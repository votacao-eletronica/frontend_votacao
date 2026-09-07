import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
    ArrowLeft,
    CaretLeft,
    CaretRight,
    Clock,
    Users,
    XCircle,
} from 'phosphor-react'
import { getEcho } from '../services/echoService'
import { sessionService } from '../services/sessionService'
import type { SessionHistory } from '../types/SessionHistory'
import { getStoredAuth } from '../utils/AuthDataStore'

type NominalVote = SessionHistory['propositions'][number]['nominal_votes'][number]
type VoteChoice = NominalVote['vote']

const voteCardStyles: Record<VoteChoice, string> = {
    yes: 'border-green-300 bg-green-50 text-green-950 shadow-green-100',
    no: 'border-red-300 bg-red-50 text-red-950 shadow-red-100',
    abstention: 'border-gray-300 bg-gray-100 text-gray-900 shadow-gray-100',
}

const pendingCardStyle = 'border-gray-200 bg-white text-gray-900'

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
    const voteByUserId = useMemo(() => {
        const votes = new Map<number, NominalVote>()
        proposition?.nominal_votes.forEach(vote => votes.set(vote.user_id, vote))
        return votes
    }, [proposition])

    const totalVoters = proposition?.nominal_votes.length ?? 0
    const totalAttendees = session?.attendees.length ?? 0
    const voteTotals = proposition?.votes ?? { yes: 0, no: 0, abstentions: 0, total: 0 }
    const progress = totalAttendees > 0 ? Math.min((totalVoters / totalAttendees) * 100, 100) : 0

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-xl text-gray-500">Preparando o painel do plenário...</div>
    }

    if (error || !session || !proposition) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50 px-6 text-center text-gray-900">
                <XCircle size={56} className="text-red-600" />
                <h1 className="text-2xl font-bold">Não foi possível exibir a votação</h1>
                <p className="max-w-xl text-gray-600">{error ?? 'Esta sessão ainda não possui propostas.'}</p>
                <button onClick={() => navigate(`/sessions/${sessionId}`)} className="rounded-md bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Voltar para a sessão</button>
            </div>
        )
    }

    return (
        <main className="min-h-screen overflow-hidden bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm lg:px-10">
                <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-6">
                    <button onClick={() => navigate(`/sessions/${sessionId}`)} className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900">
                        <ArrowLeft size={20} /> Sair do painel
                    </button>

                    <div className="min-w-0 flex-1 text-center">
                        <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-600">
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                            Votação ao vivo
                        </div>
                        <h1 className="truncate text-2xl font-black tracking-tight lg:text-4xl">{session.title}</h1>
                    </div>

                    <div className="flex min-w-36 items-center justify-end gap-2 font-mono text-xl font-bold text-gray-700">
                        <Clock size={22} className="text-blue-600" /> {formatTime(now)}
                    </div>
                </div>
            </header>

            <section className="mx-auto flex max-w-[1800px] flex-col px-6 py-7 lg:px-10 lg:py-9">
                <div className="relative mb-7 rounded-lg bg-white px-6 py-5 pb-16 shadow lg:px-8">
                    <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 pr-0 lg:pr-36">
                            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">Proposição {currentIndex + 1} de {session.propositions.length}</p>
                            <h2 className="text-2xl font-extrabold leading-tight lg:text-4xl">{proposition.title}</h2>
                            {proposition.description && <p className="mt-3 max-w-5xl text-base leading-relaxed text-gray-600 lg:text-lg">{proposition.description}</p>}
                        </div>

                        {session.propositions.length > 1 && (
                            <div className="flex shrink-0 gap-2">
                                <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(index => index - 1)} className="rounded-md border border-gray-300 bg-white p-3 text-gray-600 transition hover:bg-gray-50 disabled:opacity-25"><CaretLeft size={26} /></button>
                                <button disabled={currentIndex === session.propositions.length - 1} onClick={() => setCurrentIndex(index => index + 1)} className="rounded-md border border-gray-300 bg-white p-3 text-gray-600 transition hover:bg-gray-50 disabled:opacity-25"><CaretRight size={26} /></button>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-4 right-6 flex gap-2 lg:right-8">
                        <div title="A favor" className="flex h-11 w-11 items-center justify-center rounded-md bg-green-600 text-xl font-black text-white shadow-sm">
                            {voteTotals.yes}
                        </div>
                        <div title="Contra" className="flex h-11 w-11 items-center justify-center rounded-md bg-red-600 text-xl font-black text-white shadow-sm">
                            {voteTotals.no}
                        </div>
                        <div title="Abstenções" className="flex h-11 w-11 items-center justify-center rounded-md bg-gray-700 text-xl font-black text-white shadow-sm">
                            {voteTotals.abstentions}
                        </div>
                        <div title="Vereadores que votaram" className="flex h-11 min-w-14 items-center justify-center rounded-md bg-blue-600 px-2 text-lg font-black text-white shadow-sm">
                            {totalVoters}/{totalAttendees}
                        </div>
                    </div>
                </div>

                <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {session.attendees.map(attendee => {
                        const vote = voteByUserId.get(attendee.id)
                        const cardStyle = vote ? voteCardStyles[vote.vote] : pendingCardStyle
                        const party = vote?.user_party ?? attendee.party

                        return (
                            <article key={attendee.id} className={`flex min-h-36 items-center gap-4 rounded-lg border p-4 shadow-sm transition-colors duration-500 ${cardStyle}`}>
                                {attendee.photo ? (
                                    <img src={attendee.photo} alt={`Foto de ${attendee.name}`} className="h-20 w-20 shrink-0 rounded-md object-cover shadow-sm" />
                                ) : (
                                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-white/80 text-3xl font-black text-gray-500 shadow-sm">
                                        {attendee.name.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-xl font-black leading-tight">{attendee.name}</h3>
                                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide opacity-75">{party?.acronym ?? 'Sem partido'}</p>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <footer className="mt-6 rounded-lg bg-white px-6 py-4 shadow">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-gray-600">
                        <span className="flex items-center gap-2"><Users size={20} className="text-blue-600" /> {totalVoters} de {totalAttendees} vereadores votaram</span>
                        <span>{lastUpdate ? `Atualizado às ${formatTime(lastUpdate)}` : 'Aguardando votos'}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-blue-600 transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                </footer>
            </section>
        </main>
    )
}
