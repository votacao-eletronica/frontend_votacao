export type SessionHistory = {
    id: number; title: string; status: string; date: string
    opened_at: string | null; closed_at: string | null
    attendees: Array<{ id: number; name: string; status: string; checked_in_at: string | null }>
    propositions: Array<{
        id: number; title: string; description: string | null
        result: 'approved' | 'rejected' | null; finalized_at: string | null
        votes: { yes: number; no: number; abstentions: number; total: number }
        nominal_votes: Array<{ user_id: number; user_name: string; vote: 'yes' | 'no' | 'abstention'; voted_at: string }>
    }>
}
