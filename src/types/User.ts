export interface Role {
    id: number
    name: string
}

export interface User {
    id: number
    name: string
    email: string
    roles: Role[]
}

export type CreateUser = {
    "name": string
    "email": string
    "password": string
    "role_id": number
}