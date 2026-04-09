import type { AuthData } from "../types/AuthData"

const STORAGE_KEY = 'votacao.jwt.auth'

export function getStoredAuth(): AuthData {
    if (typeof window === 'undefined') return { token: null, user: null }

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (!data) return { token: null, user: null }
        const parsed = JSON.parse(data) as AuthData
        if (!parsed?.token) return { token: null, user: null }

        return { token: parsed.token, user: parsed.user ?? null }
    } catch {
        localStorage.removeItem(STORAGE_KEY)
        return { token: null, user: null }
    }
}

export function setStoreAuthData (data: AuthData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify( data ))
}

export function removeStoredAuthData () {
    localStorage.removeItem(STORAGE_KEY)
}