import { useCallback, useEffect, useState } from 'react'
import type { Session } from '../../types/Session'
import { sessionService } from '../../services/sessionService'
import { toast } from 'react-toastify'
import { getStoredAuth } from '../../utils/AuthDataStore'
import { getEcho } from '../../services/echoService'
import { emptyPagination, type PaginationMeta } from '../../types/Pagination'

type SessionOpenedPayload = Pick<Session, 'id' | 'status' | 'opened_at'>

export function useSessions(perPage = 10) {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState<PaginationMeta>(emptyPagination)

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true)
            const response = await sessionService.getSessions(page, perPage)
            setSessions(response.data)
            setPagination(response.meta)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar sessões'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [page, perPage])

    useEffect(() => {
        fetchSessions()
    }, [fetchSessions])

    useEffect(() => {
        const { token } = getStoredAuth()
        if (!token) return

        const echo = getEcho(token)
        const channel = echo.channel('voting-sessions')

        channel.listen('.session.opened', (event: SessionOpenedPayload) => {
            setSessions(current => current.map(session => (
                session.id === event.id ? { ...session, ...event } : session
            )))
        })

        return () => {
            echo.leaveChannel('voting-sessions')
        }
    }, [])

    const refetch = () => {
        fetchSessions()
    }

    const deleteSession = async (sessionId: number) => {
        try {
            setDeleting(true)
            await sessionService.deleteSession(sessionId)
            if (sessions.length === 1 && page > 1) {
                setPage(current => current - 1)
            } else {
                await fetchSessions()
            }
            toast.success('Sessão excluída com sucesso')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir sessão'
            toast.error(errorMessage)
        } finally {
            setDeleting(false)
        }
    }

    return { sessions, loading, error, refetch, deleteSession, deleting, pagination, page, setPage }
}
