import { useCallback, useEffect, useState } from 'react'
import type { User } from '../../types/User'
import { userService } from '../../services/userService'
import { toast } from 'react-toastify'
import { emptyPagination, type PaginationMeta } from '../../types/Pagination'

export function useUsers(perPage = 10) {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await userService.getUsers(page, perPage)
            setUsers(response.data)
            setPagination(response.meta)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [page, perPage])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const refetch = () => {
        fetchUsers()
    }

    return { users, loading, error, refetch, pagination, page, setPage }
}
