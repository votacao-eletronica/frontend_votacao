import { useEffect, useState } from 'react'
import type { PoliticalParty } from '../../types/PoliticalParty'
import { politicalPartyService } from '../../services/politicalPartyService'
import { toast } from 'react-toastify'

export function useParties() {
    const [parties, setParties] = useState<PoliticalParty[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchParties = async () => {
        try {
            setLoading(true)
            const data = await politicalPartyService.getParties()
            setParties(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar partidos políticos'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchParties()
    }, [])

    const refetch = () => {
        fetchParties()
    }

    return { parties, loading, error, refetch }
}