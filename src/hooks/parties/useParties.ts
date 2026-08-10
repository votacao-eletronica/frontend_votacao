import { useCallback, useEffect, useState } from 'react'
import type { PoliticalParty } from '../../types/PoliticalParty'
import { politicalPartyService } from '../../services/politicalPartyService'
import { toast } from 'react-toastify'
import { emptyPagination, type PaginationMeta } from '../../types/Pagination'

export function useParties(perPage = 10) {
    const [parties, setParties] = useState<PoliticalParty[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination)

    const fetchParties = useCallback(async () => {
        try {
            setLoading(true)
            const response = await politicalPartyService.getParties(page, perPage)
            setParties(response.data)
            setPagination(response.meta)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar partidos políticos'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [page, perPage])

    useEffect(() => {
        fetchParties()
    }, [fetchParties])

    const refetch = () => {
        fetchParties()
    }

    return { parties, loading, error, refetch, pagination, page, setPage }
}
