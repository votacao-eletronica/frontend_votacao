import { useState } from 'react'
import { userService } from '../../services/userService'
import { toast } from 'react-toastify'
import type { CreateUser } from '../../types/User'

export function useCreateUsers() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const createUser = async (data: CreateUser) => {
        try {
            setLoading(true)
            await userService.createUser(data)
            setError(null)
            toast.success('Usuário criado com sucesso!')
            return true
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários'
            setError(errorMessage)
            toast.error(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { createUser, loading, error }
}
