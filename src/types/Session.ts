import type { Proposal } from "./Proposal"

export type CreateSession = {
    title: string
    date: string
    status: "agendada"
}

export type Session = {
    id: number
    title: string
    status: string
    date: string
    opened_at: string | null
    closed_at: string | null
    canceled_at: string | null
    propositions?: Proposal[]
} 