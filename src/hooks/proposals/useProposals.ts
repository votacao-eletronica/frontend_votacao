import { useCallback, useEffect, useState } from 'react'
import type { Proposal } from '../../types/Proposal'
import { proposalService } from '../../services/proposalService'
import { toast } from 'react-toastify'
import { emptyPagination, type PaginationMeta } from '../../types/Pagination'

export function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination)

    const fetchProposals = useCallback(async () => {
        try {
            setLoading(true)
            const response = await proposalService.getProposals(page)
            setProposals(response.data)
            setPagination(response.meta)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar propostas'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchProposals()
    }, [fetchProposals])

    const refetch = () => {
        fetchProposals()
    }

    return { proposals, loading, error, refetch, pagination, page, setPage }
}
