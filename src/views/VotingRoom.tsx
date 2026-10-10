import { FullscreenButton } from '../components/ui/FullscreenButton'
import { isAxiosError } from 'axios'
import { Button } from '../components/form/button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CircleNotch, WarningCircle, ClipboardText, ArrowClockwise, ArrowLeft, CaretLeft, CaretRight, Check, Hand, Minus, Users, X } from 'phosphor-react'
import { toast } from 'react-toastify'
import { councilService } from '../services/councilService'
import type { CouncilMember, CouncilSession, VotingChoice } from '../types/Council'
import { getStoredAuth } from '../utils/AuthDataStore'
import { getEcho } from '../services/echoService'

const choices: Array<{ value: VotingChoice; label: string; icon: typeof Check; style: string }> = [
    { value: 'yes', label: 'A favor', icon: Check, style: 'bg-green-600 hover:bg-green-700' },
    { value: 'no', label: 'Contra', icon: X, style: 'bg-red-600 hover:bg-red-700' },
    { value: 'abstention', label: 'Abstenção', icon: Minus, style: 'bg-gray-600 hover:bg-gray-700' },
]

export function VotingRoom() {
    const { id } = useParams()
    const sessionId = Number(id)
    const [entryError, setEntryError] = useState<string | null>(null)
    const [entryAttempt, setEntryAttempt] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [session, setSession] = useState<CouncilSession | null>(null)
    const [onlineMembers, setOnlineMembers] = useState<CouncilMember[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [voting, setVoting] = useState(false)
    const [requestingSpeech, setRequestingSpeech] = useState(false)
    const [speechRequested, setSpeechRequested] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        if (!speechRequested) return
        const timer = window.setTimeout(() => setSpeechRequested(false), 10000)
        return () => window.clearTimeout(timer)
    }, [speechRequested])
    const isSessionLoaded = session !== null

    const load = useCallback(async () => setSession(await councilService.getSession(sessionId)), [sessionId])

    useEffect(() => {
        let active = true
        async function enter() {
            try {
                setEntryError(null)
                setSession(null)
                await councilService.enterSession(sessionId)
                if (!active) return
                const data = await councilService.getSession(sessionId)
                if (active) { setSession(data); setCurrentIndex(0) }
            } catch (error) {
                if (!active) return
                setEntryError(isAxiosError(error) ? error.response?.data?.message || 'Não foi possível conectar à sessão. Verifique sua conexão e tente novamente.' : 'Não foi possível entrar na sessão. Tente novamente.')
            }
        }
        enter()
        return () => { active = false }
    }, [entryAttempt, sessionId])

    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token || !isSessionLoaded) return

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
    }, [isSessionLoaded, load, navigate, sessionId])

    const currentProposal = session?.propositions[currentIndex]
    const attendees = useMemo(() => {
        return [...new Map(onlineMembers.map(member => [member.id, member])).values()]
    }, [onlineMembers])

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

    async function refreshSession() {
        setRefreshing(true)
        try { await load() } catch { toast.error('Não foi possível atualizar a sessão. Tente novamente.') }
        finally { setRefreshing(false) }
    }

    if (!session || !currentProposal) {
        const waiting = !!session && !entryError
        return (
            <main className="session-entry-page">
                <header className="session-entry-header"><span>Plenário digital</span><Button text="Voltar às sessões" variant="secondary" type="button" icon={<ArrowLeft size={17} />} onClick={() => navigate('/council')} /></header>
                <section className="session-entry-card" aria-labelledby="session-entry-title">
                    <div className={`session-entry-symbol ${entryError ? 'is-error' : ''}`} aria-hidden="true">
                        {entryError ? <WarningCircle size={32} /> : waiting ? <ClipboardText size={32} /> : <CircleNotch size={32} className="button-spinner" />}
                    </div>
                    <p className="page-eyebrow">{session?.title || 'Sessão legislativa'}</p>
                    <h1 id="session-entry-title">{entryError ? 'Não foi possível entrar' : waiting ? 'Aguardando propostas' : 'Entrando na sessão'}</h1>
                    <p className="session-entry-description" role={entryError ? 'alert' : 'status'}>{entryError || (waiting ? 'A sessão está aberta, mas ainda não há propostas disponíveis. Atualize para consultar a pauta.' : 'Estamos registrando sua presença e carregando as informações da sessão. Aguarde um instante.')}</p>
                    {!entryError && !waiting && <div className="session-entry-progress" aria-hidden="true"><span /></div>}
                    {(entryError || waiting) && <div className="session-entry-actions"><Button text={entryError ? 'Tentar novamente' : 'Atualizar propostas'} type="button" icon={<ArrowClockwise size={18} />} isLoading={refreshing} onClick={entryError ? () => setEntryAttempt(value => value + 1) : refreshSession} /><Button text="Voltar às sessões" type="button" variant="secondary" onClick={() => navigate('/council')} /></div>}
                    <p className="session-entry-footnote">Votação Eletrônica · Área do vereador</p>
                </section>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white px-5 py-4 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <button onClick={() => navigate('/council')} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"><ArrowLeft /> Sair da sessão</button>
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Sessão ao vivo</p>
                        <h1 className="font-bold">{session.title}</h1>
                    </div>
                    <div className="flex items-center gap-3"><FullscreenButton />
                    <button disabled={requestingSpeech || speechRequested} onClick={requestSpeech} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
                        <Hand weight="fill" /> {speechRequested ? 'Pedido enviado' : 'Pedir para falar'}
                    </button></div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_280px]">
                <section>
                    <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                        <span>Proposta {currentIndex + 1} de {session.propositions.length}</span>
                        <span>{Math.round(((currentIndex + 1) / session.propositions.length) * 100)}%</span>
                    </div>
                    <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-blue-600 transition-all" style={{ width: `${((currentIndex + 1) / session.propositions.length) * 100}%` }} /></div>

                    <article className="rounded-lg bg-white p-7 shadow sm:p-10">
                        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Em votação</p>
                        <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{currentProposal.title}</h2>
                        <p className="mt-5 text-lg leading-relaxed text-gray-600">{currentProposal.description}</p>

                        {currentProposal.user_vote ? (
                            <div className="mt-8 rounded-md border border-blue-200 bg-blue-50 p-5 text-center text-lg font-bold text-blue-700">
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
                        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(index => index - 1)} className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30"><CaretLeft /> Anterior</button>
                        <button disabled={currentIndex === session.propositions.length - 1} onClick={() => setCurrentIndex(index => index + 1)} className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30">Próxima <CaretRight /></button>
                    </div>
                </section>

                <aside className="rounded-lg bg-white p-5 shadow">
                    <div className="mb-5 flex items-center gap-2"><Users className="text-blue-600" /><h2 className="font-bold">Vereadores na sessão</h2></div>
                    <p className="mb-4 text-sm text-gray-500">{attendees.length} conectado(s)</p>
                    <div className="space-y-3">
                        {attendees.map(member => (
                            <div key={member.id} className="flex items-center gap-3 rounded-md bg-gray-100 p-3 text-gray-700">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="font-medium">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </main>
    )
}
