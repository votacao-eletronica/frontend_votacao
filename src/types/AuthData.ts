import type { User } from "./User";

export type AuthData = { 
    token: string | null 
    user: User | null
}