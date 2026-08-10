import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, CaretLeft, CaretRight, Check, Hand, Minus, Users, X } from 'phosphor-react'
import { toast } from 'react-toastify'
import { councilService } from '../services/councilService'
import type { CouncilMember, CouncilSession, VotingChoice } from '../types/Council'
import { getStoredAuth } from '../utils/AuthDataStore'
import { getEcho } from '../services/echoService'

const choices: Array<{ value: VotingChoice; label: string; icon: typeof Check; style: string }> = [
    { value: 'yes', label: 'A favor', icon: Check, style: 'bg-emerald-600 hover:bg-emerald-700' },
    { value: 'no', label: 'Contra', icon: X, style: 'bg-red-600 hover:bg-red-700' },
    { value: 'abstention', label: 'Abstenção', icon: Minus, style: 'bg-slate-600 hover:bg-slate-700' },
]

export function VotingRoom() {
    const { id } = useParams()
    const sessionId = Number(id)
    const [session, setSession] = useState<CouncilSession | null>(null)
    const [onlineMembers, setOnlineMembers] = useState<CouncilMember[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [voting, setVoting] = useState(false)
    const [requestingSpeech, setRequestingSpeech] = useState(false)
    const [speechRequested, setSpeechRequested] = useState(false)
    const navigate = useNavigate()

    const load = useCallback(async () => setSession(await councilService.getSession(sessionId)), [sessionId])

    useEffect(() => {
        let active = true
        async function enter() {
            try {
                await councilService.enterSession(sessionId)
                if (active) await load()
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Não foi possível entrar na sessão.')
                navigate('/council')
            }
        }
        enter()
        return () => { active = false }
    }, [load, navigate, sessionId])

    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token || !session) return

        const echo = getEcho(token)
        const channelName = `voting-session.${sessionId}`
        const channel = echo.join(channelName)

        channel
            .here((members: CouncilMember[]) => setOnlineMembers(members))
            .joining((member: CouncilMember) => setOnlineMembers(current => (
                current.some(item => item.id === member.id) ? current : [...current, member]
            )))
            .leaving((member: CouncilMember) => setOnlineMembers(current => current.filter(item => item.id !== member.id)))
            .listen('.attendance.created', load)
            .listen('.vote.cast', load)
            .listen('.session.closed', () => { toast.info('A sessão foi finalizada.'); navigate('/council') })
            .listen('.speech.requested', (event: { user: CouncilMember }) => {
                toast.info(`${event.user.name} pediu para falar.`)
            })

        return () => echo.leave(channelName)
    }, [load, sessionId, Boolean(session)])

    const currentProposal = session?.propositions[currentIndex]
    const attendees = useMemo(() => {
        const source = onlineMembers.length > 0 ? onlineMembers : (session?.attendees ?? [])
        return [...new Map(source.map(member => [member.id, member])).values()]
    }, [onlineMembers, session?.attendees])

    async function vote(choice: VotingChoice) {
        if (!currentProposal) return
        try {
            setVoting(true)
            await councilService.castVote(currentProposal.id, choice)
            await load()
            toast.success('Voto registrado com sucesso.')
            if (session && currentIndex < session.propositions.length - 1) setCurrentIndex(index => index + 1)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível registrar o voto.')
        } finally {
            setVoting(false)
        }
    }

    async function requestSpeech() {
        try {
            setRequestingSpeech(true)
            await councilService.requestSpeech(sessionId)
            setSpeechRequested(true)
            toast.success('Seu pedido para falar foi enviado.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível pedir para falar.')
        } finally {
            setRequestingSpeech(false)
        }
    }

    if (!session || !currentProposal) return <div className="min-h-screen bg-slate-950 p-8 text-slate-300">Entrando na sessão...</div>

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-slate-800 bg-slate-900 px-5 py-4">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <button onClick={() => navigate('/council')} className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"><ArrowLeft /> Sair da sessão</button>
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Sessão ao vivo</p>
                        <h1 className="font-bold">{session.title}</h1>
                    </div>
                    <button disabled={requestingSpeech || speechRequested} onClick={requestSpeech} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-60">
                        <Hand weight="fill" /> {speechRequested ? 'Pedido enviado' : 'Pedir para falar'}
                    </button>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_280px]">
                <section>
                    <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
                        <span>Proposta {currentIndex + 1} de {session.propositions.length}</span>
                        <span>{Math.round(((currentIndex + 1) / session.propositions.length) * 100)}%</span>
                    </div>
                    <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-blue-500 transition-all" style={{ width: `${((currentIndex + 1) / session.propositions.length) * 100}%` }} /></div>

                    <article className="rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl sm:p-10">
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-400">Em votação</p>
                        <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{currentProposal.title}</h2>
                        <p className="mt-5 text-lg leading-relaxed text-slate-300">{currentProposal.description}</p>

                        {currentProposal.user_vote ? (
                            <div className="mt-8 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 text-center text-lg font-bold text-blue-300">
                                Voto registrado: {choices.find(item => item.value === currentProposal.user_vote)?.label}
                            </div>
                        ) : (
                            <div className="mt-9 grid gap-4 sm:grid-cols-3">
                                {choices.map(choice => {
                                    const Icon = choice.icon
                                    return <button key={choice.value} disabled={voting} onClick={() => vote(choice.value)} className={`flex min-h-24 items-center justify-center gap-3 rounded-xl px-5 py-4 text-lg font-bold disabled:opacity-50 ${choice.style}`}><Icon size={28} weight="bold" />{choice.label}</button>
                                })}
                            </div>
                        )}
                    </article>

                    <div className="mt-6 flex justify-between">
                        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(index => index - 1)} className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-semibold text-slate-300 disabled:opacity-30"><CaretLeft /> Anterior</button>
                        <button disabled={currentIndex === session.propositions.length - 1} onClick={() => setCurrentIndex(index => index + 1)} className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-semibold text-slate-300 disabled:opacity-30">Próxima <CaretRight /></button>
                    </div>
                </section>

                <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-5 flex items-center gap-2"><Users className="text-emerald-400" /><h2 className="font-bold">Vereadores na sessão</h2></div>
                    <p className="mb-4 text-sm text-slate-400">{attendees.length} conectado(s)</p>
                    <div className="space-y-3">
                        {attendees.map(member => (
                            <div key={member.id} className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                <span className="font-medium">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    )
}
