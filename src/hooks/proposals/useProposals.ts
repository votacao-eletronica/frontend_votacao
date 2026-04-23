import { useEffect, useState } from 'react'
import type { Proposal } from '../../types/Proposal'
import { proposalService } from '../../services/proposalService'
import { toast } from 'react-toastify'

export function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProposals = async () => {
        try {
            setLoading(true)
            const data = await proposalService.getProposals()
            setProposals(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar propostas'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProposals()
    }, [])

    const refetch = () => {
        fetchProposals()
    }

    return { proposals, loading, error, refetch }
}
