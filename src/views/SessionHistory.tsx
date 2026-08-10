import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, CheckCircle, XCircle, Users } from 'phosphor-react'
import { sessionService } from '../services/sessionService'
import type { SessionHistory as History } from '../types/SessionHistory'

const labels = { yes: 'A favor', no: 'Contra', abstention: 'Abstenção' }

export function SessionHistory() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [history, setHistory] = useState<History | null>(null)
    useEffect(() => { sessionService.getHistory(Number(id)).then(setHistory) }, [id])
    if (!history) return <div className="p-8 text-slate-500">Carregando histórico...</div>

    return <main className="min-h-full bg-slate-50 p-8"><div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/sessions')} className="mb-5 flex items-center gap-2 font-semibold text-slate-600"><ArrowLeft /> Voltar</button>
        <header className="mb-8 rounded-2xl bg-slate-900 p-7 text-white"><p className="text-sm font-bold uppercase text-blue-300">Histórico da sessão</p><h1 className="mt-2 text-3xl font-bold">{history.title}</h1><div className="mt-5 flex gap-5 text-sm text-slate-300"><span>Aberta: {history.opened_at ? new Date(history.opened_at).toLocaleString('pt-BR') : '-'}</span><span>Finalizada: {history.closed_at ? new Date(history.closed_at).toLocaleString('pt-BR') : '-'}</span><span className="flex items-center gap-1"><Users /> {history.attendees.length} presente(s)</span></div></header>
        <section className="mb-8 rounded-2xl bg-white p-6"><h2 className="mb-4 text-xl font-bold">Vereadores presentes</h2><div className="grid gap-3 sm:grid-cols-3">{history.attendees.map(member => <div key={member.id} className="rounded-lg bg-slate-100 p-3">{member.name}</div>)}</div></section>
        <div className="space-y-6">{history.propositions.map((proposal, index) => <article key={proposal.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex justify-between gap-4"><div><p className="text-xs font-bold uppercase text-blue-600">Proposta {index + 1}</p><h2 className="text-xl font-bold">{proposal.title}</h2></div><span className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold ${proposal.result === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{proposal.result === 'approved' ? <CheckCircle /> : <XCircle />}{proposal.result === 'approved' ? 'Aprovada' : 'Rejeitada'}</span></div>
            <p className="mt-3 text-slate-600">{proposal.description}</p><div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="rounded bg-emerald-50 p-3"><b className="block text-2xl">{proposal.votes.yes}</b>A favor</div><div className="rounded bg-red-50 p-3"><b className="block text-2xl">{proposal.votes.no}</b>Contra</div><div className="rounded bg-slate-100 p-3"><b className="block text-2xl">{proposal.votes.abstentions}</b>Abstenções</div></div>
            <h3 className="mb-3 mt-6 font-bold">Votação nominal</h3><div className="rounded border">{proposal.nominal_votes.map(vote => <div key={vote.user_id} className="flex justify-between border-b px-4 py-3 last:border-0"><span>{vote.user_name}</span><b>{labels[vote.vote]}</b></div>)}</div>
        </article>)}</div>
    </div></main>
}
