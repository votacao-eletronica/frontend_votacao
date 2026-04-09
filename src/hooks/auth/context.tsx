import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ToastError } from '../../components/alert/toastError'
import { getStoredAuth, removeStoredAuthData, setStoreAuthData } from '../../utils/AuthDataStore'
import type { User } from '../../types/User'
import type { AuthData } from '../../types/AuthData'

type Credentials = {
    email: string
    password: string
}

type AuthContextData = {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    login: (credentials: Credentials) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

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

            const data = response.data as AuthData
            if (!data.token) throw new Error('Token JWT inválido ou ausente na resposta')

            setStoreAuthData( data )
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
        removeStoredAuthData()
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