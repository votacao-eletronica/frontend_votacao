import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Clock, SignIn, ListChecks } from 'phosphor-react'
import { toast } from 'react-toastify'
import { councilService } from '../services/councilService'
import type { OpenCouncilSession } from '../types/Council'
import { getStoredAuth } from '../utils/AuthDataStore'
import { getEcho } from '../services/echoService'

export function CouncilDashboard() {
    const [sessions, setSessions] = useState<OpenCouncilSession[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const loadSessions = useCallback(async () => {
        try {
            setSessions(await councilService.getOpenSessions())
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível carregar as sessões abertas.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadSessions() }, [loadSessions])

    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token) return
        const echo = getEcho(token)
        echo.channel('voting-sessions')
            .listen('.session.opened', loadSessions)
            .listen('.session.closed', (event: { id: number }) => {
                setSessions(current => current.filter(session => session.id !== event.id))
            })
        return () => echo.leaveChannel('voting-sessions')
    }, [loadSessions])

    return (
        <main className="min-h-full bg-slate-50 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Plenário digital</p>
                    <h1 className="text-3xl font-bold text-slate-900">Sessões abertas</h1>
                    <p className="mt-2 text-slate-600">Entre em uma sessão para registrar presença e votar nas propostas.</p>
                </div>

                {loading ? (
                    <p className="text-slate-500">Carregando sessões...</p>
                ) : sessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <Clock className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-800">Nenhuma sessão aberta</h2>
                        <p className="mt-1 text-slate-500">Esta tela será atualizada automaticamente quando uma sessão começar.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {sessions.map(session => (
                            <article key={session.id} className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
                                <div className="h-1.5 bg-emerald-500" />
                                <div className="p-6">
                                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">Ao vivo</span>
                                    <h2 className="mt-4 text-xl font-bold text-slate-900">{session.title}</h2>
                                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                                        <ListChecks className="h-5 w-5" />
                                        {session.propositions_count} proposta(s)
                                    </div>
                                    <button onClick={() => navigate(`/council/sessions/${session.id}`)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">
                                        <SignIn className="h-5 w-5" /> Entrar na sessão
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
