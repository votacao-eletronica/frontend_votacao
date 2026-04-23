import { useState } from 'react'
import { toast } from 'react-toastify'
import { proposalService, type CreateProposal } from '../../services/proposalService'

export function useCreateProposal() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createProposal = async (data: CreateProposal) => {
        try {
            setLoading(true)
            await proposalService.createProposal(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar proposta'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { createProposal, loading, error }
}
