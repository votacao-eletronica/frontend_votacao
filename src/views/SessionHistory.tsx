import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, CheckCircle, DownloadSimple, XCircle, Users } from 'phosphor-react'
import { toast } from 'react-toastify'
import { sessionService } from '../services/sessionService'
import type { SessionHistory as History } from '../types/SessionHistory'

const labels = { yes: 'A favor', no: 'Contra', abstention: 'Abstenção' }

export function SessionHistory() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [history, setHistory] = useState<History | null>(null)
    const [downloading, setDownloading] = useState(false)
    useEffect(() => { sessionService.getHistory(Number(id)).then(setHistory) }, [id])
    if (!history) return <div className="p-8 text-gray-500">Carregando histórico...</div>

    return <main className="min-h-full bg-gray-50 p-8"><div className="mx-auto max-w-6xl">
        <button onClick={() => navigate('/sessions')} className="mb-5 flex items-center gap-2 font-semibold text-gray-600 hover:text-gray-900"><ArrowLeft /> Voltar</button>
        <header className="mb-8 rounded-lg bg-white p-6 shadow"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase text-blue-600">Histórico da sessão</p><h1 className="mt-2 text-3xl font-bold text-gray-900">{history.title}</h1></div><button disabled={downloading} onClick={async () => { try { setDownloading(true); await sessionService.downloadMinutes(history.id) } catch (error) { toast.error(error instanceof Error ? error.message : 'Não foi possível gerar a ata.') } finally { setDownloading(false) } }} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"><DownloadSimple size={21} />{downloading ? 'Gerando...' : 'Baixar ata em PDF'}</button></div><div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-600"><span>Aberta: {history.opened_at ? new Date(history.opened_at).toLocaleString('pt-BR') : '-'}</span><span>Finalizada: {history.closed_at ? new Date(history.closed_at).toLocaleString('pt-BR') : '-'}</span><span className="flex items-center gap-1"><Users /> {history.attendees.length} presente(s)</span></div></header>
        <section className="mb-8 rounded-lg bg-white p-6 shadow"><h2 className="mb-4 text-xl font-semibold text-gray-900">Vereadores presentes</h2><div className="grid gap-3 sm:grid-cols-3">{history.attendees.map(member => <div key={member.id} className="rounded-md bg-gray-100 p-3 text-gray-700">{member.name}</div>)}</div></section>
        <div className="space-y-6">{history.propositions.map((proposal, index) => <article key={proposal.id} className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-blue-600">Proposta {index + 1}</p><h2 className="text-xl font-semibold text-gray-900">{proposal.title}</h2></div><span className={`flex h-11 w-32 shrink-0 items-center justify-center gap-2 rounded-full font-bold ${proposal.result === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{proposal.result === 'approved' ? <CheckCircle /> : <XCircle />}{proposal.result === 'approved' ? 'Aprovada' : 'Rejeitada'}</span></div>
            <p className="mt-3 text-gray-600">{proposal.description}</p><div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="rounded-md bg-green-50 p-3 text-green-700"><b className="block text-2xl">{proposal.votes.yes}</b>A favor</div><div className="rounded-md bg-red-50 p-3 text-red-700"><b className="block text-2xl">{proposal.votes.no}</b>Contra</div><div className="rounded-md bg-gray-100 p-3 text-gray-700"><b className="block text-2xl">{proposal.votes.abstentions}</b>Abstenções</div></div>
            <h3 className="mb-3 mt-6 font-bold">Votação nominal</h3><div className="rounded border">{proposal.nominal_votes.map(vote => <div key={vote.user_id} className="flex justify-between border-b px-4 py-3 last:border-0"><span>{vote.user_name}</span><b>{labels[vote.vote]}</b></div>)}</div>
        </article>)}</div>
    </div></main>
}
