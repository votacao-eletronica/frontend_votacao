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
