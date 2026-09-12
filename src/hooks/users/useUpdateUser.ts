import { useState } from 'react'
import { userService } from '../../services/userService'
import { toast } from 'react-toastify'
import type { UpdateUser } from '../../types/User'

export function useUpdateUser() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const updateUser = async (id: number, data: UpdateUser) => {
        try {
            setLoading(true)
            await userService.updateUser(id, data)
            setError(null)
            toast.success('Usuário atualizado com sucesso!')
            return true
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário'
            setError(errorMessage)
            toast.error(errorMessage)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { updateUser, loading, error }
}
