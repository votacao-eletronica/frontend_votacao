export type OpenCouncilSession = {
    id: number
    title: string
    date: string
    status: 'aberta'
    opened_at: string | null
    propositions_count: number
}

export type VotingChoice = 'yes' | 'no' | 'abstention'

export type VotingProposition = {
    id: number
    title: string
    description: string | null
    status: string
    user_vote: VotingChoice | null
}

export type CouncilSession = OpenCouncilSession & {
    propositions: VotingProposition[]
    attendees: CouncilMember[]
}

export type CouncilMember = { id: number; name: string }

export type NominalVote = { user_id: number; user_name: string; vote: VotingChoice }

export type PresentationProposition = Omit<VotingProposition, 'user_vote'> & {
    votes: { yes: number; no: number; abstentions: number; total: number }
    nominal_votes: NominalVote[]
}

export type PresentationSession = Omit<CouncilSession, 'propositions'> & {
    propositions: PresentationProposition[]
}

export type ClosedCouncilSession = {
    id: number
    title: string
    status: 'fechada'
    date: string
    opened_at: string | null
    closed_at: string | null
    propositions_count: number
    attendances_count: number
}
