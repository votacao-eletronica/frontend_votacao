import { useState } from 'react'
import { userService } from '../../services/userService'
import { toast } from 'react-toastify'

export function useDeleteUser() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const deleteUser = async (id: number) => {
        try {
            setLoading(true)
            await userService.deleteUser(id)
            setError(null)
            toast.success('Usuário deletado com sucesso!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar usuário'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { deleteUser, loading, error }
}