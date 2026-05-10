import { useEffect, useState } from 'react'
import type { Session } from '../../types/Session'
import { sessionService } from '../../services/sessionService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

export function useSession(sessionId: number | undefined) {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [openingSession, setOpeningSession] = useState(false)
    const [deletingSession, setDeletingSession] = useState(false)
    const navigate = useNavigate()

    const fetchSession = async () => {
        if (!sessionId) return
        try {
            setLoading(true)
            const data = await sessionService.getSession(sessionId)
            setSession(data)
            setError(null)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar sessão'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSession()
    }, [sessionId])

    const refetch = () => {
        fetchSession()
    }

    const handleOpenSession = async () => {
        if (!sessionId) return
        try {
            setOpeningSession(true)
            const updatedSession = await sessionService.openSession(sessionId)
            setSession(updatedSession)
            toast.success('Sessão aberta com sucesso')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao abrir sessão'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setOpeningSession(false)
        }
    }

    const handleDeleteSession = async () => {
        if (!sessionId) return
        try {
            setDeletingSession(true)
            await sessionService.deleteSession(sessionId)
            toast.success('Sessão excluída com sucesso')
            navigate('/sessions')
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir sessão'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setDeletingSession(false)
        }
    }

    return { session, loading, error, refetch, openingSession, handleOpenSession, deletingSession, handleDeleteSession }
}