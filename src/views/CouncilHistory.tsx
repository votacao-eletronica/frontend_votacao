import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CalendarCheck, ChartBar, Users } from 'phosphor-react'
import { councilService } from '../services/councilService'
import type { ClosedCouncilSession } from '../types/Council'
import { emptyPagination, type PaginationMeta } from '../types/Pagination'
import { Pagination } from '../components/ui/Pagination'

export function CouncilHistory() {
    const [sessions, setSessions] = useState<ClosedCouncilSession[]>([])
    const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        councilService.getHistory(page).then(response => {
            setSessions(response.data)
            setPagination(response.meta)
        }).finally(() => setLoading(false))
    }, [page])

    return <main className="min-h-full bg-slate-50 p-8"><div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Plenário digital</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Histórico de sessões</h1>
        <p className="mt-2 text-slate-600">Consulte resultados, presenças e votação nominal das sessões encerradas.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{sessions.map(session => <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">Finalizada</span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{session.title}</h2>
            <div className="mt-5 space-y-2 text-sm text-slate-600"><p className="flex items-center gap-2"><CalendarCheck /> {session.closed_at ? new Date(session.closed_at).toLocaleString('pt-BR') : '-'}</p><p className="flex items-center gap-2"><ChartBar /> {session.propositions_count} proposta(s)</p><p className="flex items-center gap-2"><Users /> {session.attendances_count} participante(s)</p></div>
            <button onClick={() => navigate(`/sessions/${session.id}/history`)} className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800">Ver resultado completo</button>
        </article>)}</div>
        {!loading && sessions.length === 0 && <div className="mt-8 rounded-2xl border border-dashed p-12 text-center text-slate-500">Nenhuma sessão encerrada.</div>}
        <div className="mt-6 rounded-xl bg-white"><Pagination meta={pagination} loading={loading} onPageChange={setPage} /></div>
    </div></main>
}
