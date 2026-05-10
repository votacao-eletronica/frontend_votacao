import { useEffect, useState } from 'react'
import type { Session } from '../../types/Session'
import { sessionService } from '../../services/sessionService'
import { toast } from 'react-toastify'

export function useSessions() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchSessions = async () => {
        try {
            setLoading(true)
            const data = await sessionService.getSessions()
            setSessions(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar sessões'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    const refetch = () => {
        fetchSessions()
    }

    const deleteSession = async (sessionId: number) => {
        try {
            setDeleting(true)
            await sessionService.deleteSession(sessionId)
            setSessions(prev => prev.filter(session => session.id !== sessionId))
            toast.success('Sessão excluída com sucesso')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir sessão'
            toast.error(errorMessage)
        } finally {
            setDeleting(false)
        }
    }

    return { sessions, loading, error, refetch, deleteSession, deleting }
}
