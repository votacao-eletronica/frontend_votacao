import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ToastError } from '../../components/alert/toastError'

type User = {
    id?: string
    name?: string
    email?: string
} | null

type Credentials = {
    email: string
    password: string
}

type AuthContextData = {
    token: string | null
    user: User
    isAuthenticated: boolean
    login: (credentials: Credentials) => Promise<void>
    logout: () => void
}

const STORAGE_KEY = 'votacao.jwt.auth'

export const AuthContext = createContext<AuthContextData | undefined>(undefined)

function getStoredAuth() {
    if (typeof window === 'undefined') return { token: null, user: null }

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        if (!data) return { token: null, user: null }
        const parsed = JSON.parse(data) as { token: string; user: User }
        if (!parsed?.token) return { token: null, user: null }

        return { token: parsed.token, user: parsed.user ?? null }
    } catch {
        localStorage.removeItem(STORAGE_KEY)
        return { token: null, user: null }
    }
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        const stored = getStoredAuth()
        setToken(stored.token)
        setUser(stored.user)
    }, [])

    const login = useCallback(async ({ email, password }: Credentials) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, {
                email,
                password
            })

            const data = response.data as { token: string, user: User }
            if (!data.token) throw new Error('Token JWT inválido ou ausente na resposta')

            localStorage.setItem(STORAGE_KEY, JSON.stringify({ data }))
            setToken(data.token)
            setUser(data.user)
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : (error as Error).message

            toast.error(ToastError, {
                data: {
                    title: 'Ocorreu um erro!',
                    content: message,
                },
                ariaLabel: message,
                autoClose: 5000,
                icon: false,
                theme: 'colored',
            });
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        setToken(null)
        setUser(null)
    }, [])

    const isAuthenticated = useMemo(() => Boolean(token), [token])

    const value = useMemo(
        () => ({ token, user, isAuthenticated, login, logout }),
        [token, user, isAuthenticated, login, logout]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}