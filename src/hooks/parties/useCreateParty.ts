import { useState } from 'react'
import { toast } from 'react-toastify'
import { politicalPartyService, type CreatePoliticalParty } from '../../services/politicalPartyService'

export function useCreateParty() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createParty = async (data: CreatePoliticalParty) => {
        try {
            setLoading(true)
            await politicalPartyService.createParty(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar partido político'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { createParty, loading, error }
}
