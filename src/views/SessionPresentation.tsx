import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowsOut, Check, Minus, X } from 'phosphor-react'
import { useParams } from 'react-router'
import { councilService } from '../services/councilService'
import { getEcho } from '../services/echoService'
import type { PresentationSession, VotingChoice } from '../types/Council'
import { getStoredAuth } from '../utils/AuthDataStore'

const voteMeta: Record<VotingChoice, { label: string; text: string; badge: string }> = {
    yes: { label: 'SIM', text: 'text-emerald-600', badge: 'bg-emerald-500' },
    abstention: { label: 'ABSTENÇÃO', text: 'text-cyan-600', badge: 'bg-cyan-500' },
    no: { label: 'NÃO', text: 'text-rose-600', badge: 'bg-rose-500' },
}

export function SessionPresentation() {
    const { id } = useParams()
    const sessionId = Number(id)
    const [session, setSession] = useState<PresentationSession | null>(null)
    const [proposalIndex, setProposalIndex] = useState(0)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        try { setSession(await councilService.getPresentation(sessionId)); setError('') }
        catch { setError('Não foi possível carregar a apresentação.') }
    }, [sessionId])

    useEffect(() => { load() }, [load])
    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token || !sessionId) return
        const echo = getEcho(token)
        const channelName = `voting-session.${sessionId}`
        echo.join(channelName).listen('.attendance.created', load).listen('.vote.cast', load).listen('.session.closed', load)
        return () => echo.leave(channelName)
    }, [load, sessionId])
    useEffect(() => {
        if (!session?.propositions.length) return
        const votingIndex = session.propositions.findIndex(item => item.status === 'votando')
        if (votingIndex >= 0) setProposalIndex(votingIndex)
    }, [session])

    const proposal = session?.propositions[proposalIndex]
    const members = useMemo(() => {
        const votes = new Map(proposal?.nominal_votes.map(item => [item.user_id, item.vote]))
        return session?.attendees.map(member => ({ ...member, vote: votes.get(member.id) })) ?? []
    }, [proposal, session?.attendees])

    async function fullscreen() {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
        else await document.exitFullscreen()
    }

    if (error) return <main className="grid min-h-screen place-items-center bg-slate-950 text-2xl text-rose-300">{error}</main>
    if (!session || !proposal) return <main className="grid min-h-screen place-items-center bg-slate-950 text-2xl text-white">Preparando apresentação...</main>

    const scoreboard = [
        { label: 'Sim', value: proposal.votes.yes, color: 'bg-emerald-500', Icon: Check },
        { label: 'Abstenção', value: proposal.votes.abstentions, color: 'bg-cyan-500', Icon: Minus },
        { label: 'Não', value: proposal.votes.no, color: 'bg-rose-500', Icon: X },
    ]

    return <main className="flex min-h-screen flex-col bg-[#f3f4f3] text-slate-900">
        <header className="grid bg-[#111827] text-white shadow-lg lg:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 items-center gap-[1.4vw] px-[2vw] py-[1.5vh]">
                <div className="hidden h-[8vh] w-[8vh] shrink-0 place-items-center rounded-full border-2 border-white/25 bg-white/10 text-center text-[clamp(.55rem,.72vw,.85rem)] font-black uppercase leading-tight sm:grid">Câmara<br />Municipal</div>
                <div className="min-w-0"><p className="text-[clamp(.62rem,.82vw,.95rem)] font-bold uppercase tracking-[.16em] text-slate-300">Projeto em votação</p><h1 className="truncate text-[clamp(1rem,1.55vw,1.9rem)] font-black">{proposal.title}</h1>{proposal.description && <p className="mt-1 line-clamp-2 max-w-5xl text-[clamp(.7rem,.92vw,1.05rem)] leading-snug text-slate-300">{proposal.description}</p>}<p className="mt-1 text-[clamp(.62rem,.78vw,.9rem)] font-semibold text-slate-400">{session.title}</p></div>
            </div>
            <div className="flex border-t border-white/10 lg:border-l lg:border-t-0">{scoreboard.map(({ label, value, color, Icon }) => <div key={label} className={`${color} flex min-w-[clamp(6.2rem,9vw,10.5rem)] flex-1 items-center justify-center gap-2 px-[1.3vw] py-[1vh]`}><div><p className="text-[clamp(.55rem,.72vw,.82rem)] font-black uppercase tracking-wider text-white/85">{label}</p><strong className="block text-[clamp(2.2rem,4.4vw,5.4rem)] font-black leading-none tabular-nums">{value}</strong></div><Icon className="hidden opacity-70 sm:block" size={28} weight="bold" /></div>)}</div>
        </header>

        {session.propositions.length > 1 && <select aria-label="Selecionar pauta" value={proposalIndex} onChange={event => setProposalIndex(Number(event.target.value))} className="absolute left-2 top-2 z-10 max-w-44 rounded border border-white/20 bg-slate-900/90 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:opacity-100 focus:opacity-100">{session.propositions.map((item, index) => <option key={item.id} value={index}>{index + 1}. {item.title}</option>)}</select>}

        <section className="grid flex-1 auto-rows-fr grid-cols-1 divide-y divide-slate-200 overflow-hidden bg-white sm:grid-cols-2 sm:divide-x xl:grid-cols-3">
            {members.map(member => {
                const meta = member.vote ? voteMeta[member.vote] : null
                const initials = member.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
                return <article key={member.id} className="flex min-h-[clamp(4.4rem,9.2vh,7.5rem)] items-center gap-[1vw] border-b border-slate-200 px-[1.4vw] py-[.8vh]"><div className="grid h-[clamp(2.8rem,5.5vh,4.5rem)] w-[clamp(2.8rem,5.5vh,4.5rem)] shrink-0 place-items-center rounded-full bg-slate-200 text-[clamp(.7rem,1vw,1.1rem)] font-black text-slate-500 ring-2 ring-white shadow">{initials}</div><div className="min-w-0 flex-1"><h2 className="truncate text-[clamp(.82rem,1.16vw,1.4rem)] font-extrabold leading-tight text-slate-800">{member.name}</h2><p className={`mt-1 text-[clamp(.68rem,.9vw,1rem)] font-black uppercase ${meta?.text ?? 'text-slate-400'}`}>{meta?.label ?? 'NÃO VOTOU'}</p></div><span className={`h-3 w-3 shrink-0 rounded-full ${meta?.badge ?? 'bg-slate-300'}`} /></article>
            })}
        </section>

        <footer className="relative flex items-center justify-between gap-4 bg-[#111827] px-[2vw] py-[1.1vh] text-white"><span className="text-[clamp(.65rem,.85vw,.95rem)] font-semibold text-slate-300">{session.attendees.length} vereadores presentes • {proposal.votes.total} votos registrados</span><strong className="absolute left-1/2 -translate-x-1/2 rounded-sm bg-amber-400 px-4 py-1 text-[clamp(.65rem,.85vw,.95rem)] font-black uppercase text-slate-950">Votação em andamento</strong><button onClick={fullscreen} className="rounded border border-white/20 p-1.5 text-slate-300 hover:bg-white/10 hover:text-white" title="Alternar tela cheia"><ArrowsOut size={22} /></button></footer>
    </main>
}
