import { useEffect, useState } from 'react'
import type { User } from '../../types/User'
import { userService } from '../../services/userService'
import { toast } from 'react-toastify'

export function useUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const data = await userService.getUsers()
                setUsers(data)
                setError(null)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários'
                setError(errorMessage)
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return { users, loading, error }
}
