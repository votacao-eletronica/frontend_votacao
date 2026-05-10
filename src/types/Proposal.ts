export type Proposal = {
    id: number
    title: string
    description: string
    status: string
    voting_session: {
        id: number | null
    }
}