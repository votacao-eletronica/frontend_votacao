import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
    ArrowLeft,
    CaretLeft,
    CaretRight,
    CheckCircle,
    Clock,
    MinusCircle,
    Users,
    XCircle,
} from 'phosphor-react'
import { getEcho } from '../services/echoService'
import { sessionService } from '../services/sessionService'
import type { SessionHistory } from '../types/SessionHistory'
import { getStoredAuth } from '../utils/AuthDataStore'

type NominalVote = SessionHistory['propositions'][number]['nominal_votes'][number]
type VoteChoice = NominalVote['vote']

const columns: Array<{
    choice: VoteChoice
    title: string
    accent: string
    surface: string
    icon: typeof CheckCircle
}> = [
    { choice: 'yes', title: 'A favor', accent: 'text-emerald-300', surface: 'border-emerald-400/30 bg-emerald-400/10', icon: CheckCircle },
    { choice: 'no', title: 'Contra', accent: 'text-rose-300', surface: 'border-rose-400/30 bg-rose-400/10', icon: XCircle },
    { choice: 'abstention', title: 'Abstenção', accent: 'text-amber-300', surface: 'border-amber-400/30 bg-amber-400/10', icon: MinusCircle },
]

function formatTime(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date)
}

export function SessionPresentation() {
    const { id } = useParams<{ id: string }>()
    const sessionId = Number(id)
    const navigate = useNavigate()
    const [session, setSession] = useState<SessionHistory | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [now, setNow] = useState(() => new Date())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const load = useCallback(async () => {
        if (!Number.isFinite(sessionId)) return

        try {
            const data = await sessionService.getHistory(sessionId)
            setSession(data)
            setLastUpdate(new Date())
            setError(null)
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar o painel.')
        } finally {
            setLoading(false)
        }
    }, [sessionId])

    useEffect(() => {
        load()
    }, [load])

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000)
        return () => window.clearInterval(timer)
    }, [])

    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token || !Number.isFinite(sessionId)) return

        const echo = getEcho(token)
        const channelName = `voting-session.${sessionId}`
        const channel = echo.join(channelName)

        channel
            .listen('.vote.cast', load)
            .listen('.attendance.created', load)
            .listen('.session.closed', load)

        return () => echo.leave(channelName)
    }, [load, sessionId])

    const proposition = session?.propositions[currentIndex]
    const groupedVotes = useMemo(() => {
        const groups: Record<VoteChoice, NominalVote[]> = {
            yes: [],
            no: [],
            abstention: [],
        }

        proposition?.nominal_votes.forEach(vote => groups[vote.vote].push(vote))
        return groups
    }, [proposition])

    const totalVoters = proposition?.nominal_votes.length ?? 0
    const totalAttendees = session?.attendees.length ?? 0
    const progress = totalAttendees > 0 ? Math.min((totalVoters / totalAttendees) * 100, 100) : 0

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-xl text-slate-300">Preparando o painel do plenário...</div>
    }

    if (error || !session || !proposition) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 px-6 text-center text-white">
                <XCircle size={56} className="text-rose-400" />
                <h1 className="text-2xl font-bold">Não foi possível exibir a votação</h1>
                <p className="max-w-xl text-slate-400">{error ?? 'Esta sessão ainda não possui propostas.'}</p>
                <button onClick={() => navigate(`/sessions/${sessionId}`)} className="rounded-xl bg-white/10 px-5 py-3 font-semibold hover:bg-white/20">Voltar para a sessão</button>
            </div>
        )
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#18345f_0%,_#0b1730_42%,_#050b18_100%)] text-white">
            <header className="border-b border-white/10 bg-slate-950/35 px-6 py-5 backdrop-blur-xl lg:px-10">
                <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-6">
                    <button onClick={() => navigate(`/sessions/${sessionId}`)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
                        <ArrowLeft size={20} /> Sair do painel
                    </button>

                    <div className="min-w-0 flex-1 text-center">
                        <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-400 shadow-[0_0_18px_#fb7185]" />
                            Votação ao vivo
                        </div>
                        <h1 className="truncate text-2xl font-black tracking-tight lg:text-4xl">{session.title}</h1>
                    </div>

                    <div className="flex min-w-36 items-center justify-end gap-2 font-mono text-xl font-bold text-slate-200">
                        <Clock size={22} className="text-cyan-300" /> {formatTime(now)}
                    </div>
                </div>
            </header>

            <section className="mx-auto flex max-w-[1800px] flex-col px-6 py-7 lg:px-10 lg:py-9">
                <div className="mb-7 rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-5 shadow-2xl backdrop-blur-sm lg:px-8">
                    <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Proposição {currentIndex + 1} de {session.propositions.length}</p>
                            <h2 className="text-2xl font-extrabold leading-tight lg:text-4xl">{proposition.title}</h2>
                            {proposition.description && <p className="mt-3 max-w-5xl text-base leading-relaxed text-slate-300 lg:text-lg">{proposition.description}</p>}
                        </div>

                        {session.propositions.length > 1 && (
                            <div className="flex shrink-0 gap-2">
                                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(index => index - 1)} className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 disabled:opacity-25"><CaretLeft size={26} /></button>
                                <button disabled={currentIndex === session.propositions.length - 1} onClick={() => setCurrentIndex(index => index + 1)} className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 disabled:opacity-25"><CaretRight size={26} /></button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid flex-1 gap-5 lg:grid-cols-3">
                    {columns.map(column => {
                        const Icon = column.icon
                        const votes = groupedVotes[column.choice]

                        return (
                            <article key={column.choice} className={`min-h-[410px] rounded-3xl border p-5 shadow-2xl backdrop-blur-sm lg:p-7 ${column.surface}`}>
                                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                                    <div className={`flex items-center gap-3 ${column.accent}`}>
                                        <Icon size={36} weight="fill" />
                                        <h3 className="text-2xl font-black uppercase tracking-wide">{column.title}</h3>
                                    </div>
                                    <span className={`flex h-14 min-w-14 items-center justify-center rounded-2xl bg-slate-950/40 px-4 text-3xl font-black ${column.accent}`}>{votes.length}</span>
                                </div>

                                {votes.length === 0 ? (
                                    <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-slate-400">Nenhum voto registrado</div>
                                ) : (
                                    <div className="grid gap-3 xl:grid-cols-2">
                                        {votes.map(vote => (
                                            <div key={vote.user_id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-4 shadow-lg transition duration-500 animate-[pulse_700ms_ease-out_1]">
                                                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950/60 text-lg font-black ${column.accent}`}>{vote.user_name.charAt(0).toUpperCase()}</span>
                                                <span className="text-base font-bold leading-tight lg:text-lg">{vote.user_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>

                <footer className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 px-6 py-4 backdrop-blur-sm">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-300">
                        <span className="flex items-center gap-2"><Users size={20} className="text-cyan-300" /> {totalVoters} de {totalAttendees} vereadores votaram</span>
                        <span>{lastUpdate ? `Atualizado às ${formatTime(lastUpdate)}` : 'Aguardando votos'}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                </footer>
            </section>
        </main>
    )
}
