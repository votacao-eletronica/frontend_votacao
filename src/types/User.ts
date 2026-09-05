import type { PoliticalParty } from './PoliticalParty'

export interface Role {
    id: number
    name: string
}

export interface User {
    id: number
    name: string
    email: string
    roles: Role[]
    photo: string | null
    current_party: PoliticalParty | null
    party_history: PartyMembership[]
}

export interface PartyMembership {
    id: number
    party: PoliticalParty | null
    start_date: string
    end_date: string | null
}

export type CreateUser = {
    name: string
    email: string
    password: string
    role_id: number
    photo?: File | null
    party_id?: number | null
}

export type UpdateUser = {
    name?: string
    email?: string
    role_id?: number
    photo?: File | null
    party_id?: number | null
}
