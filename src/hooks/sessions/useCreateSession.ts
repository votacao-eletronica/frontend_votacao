import { useState } from 'react'
import { toast } from 'react-toastify'
import { sessionService } from '../../services/sessionService'
import type { CreateSession } from '../../types/Session'

export function useCreateSession() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createSession = async (data: CreateSession) => {
        try {
            setLoading(true)
            await sessionService.createSession(data)
            setError(null)
            toast.success('Sessão criada com sucesso!')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar sessão'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return { createSession, loading, error }
}
