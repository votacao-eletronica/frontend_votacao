import { useState } from 'react'
import { toast } from 'react-toastify'
import { proposalService, type UpdateProposal } from '../../services/proposalService'

export function useUpdateProposal() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateProposal = async (data: UpdateProposal) => {
        try {
            setLoading(true)
            await proposalService.updateProposal(data)
            setError(null)
            toast.success('Proposta atualizada com sucesso')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar proposta'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { updateProposal, loading, error }
}
