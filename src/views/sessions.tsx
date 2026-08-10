import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSessions } from '../hooks/sessions/useSessions'
import { SessionsTable } from '../components/sessions/SessionsTable'
import { CreateSessionModal } from '../components/sessions/CreateSessionModal'
import { Button } from '../components/form/button'
import type { Session } from '../types/Session'
import { Pagination } from '../components/ui/Pagination'

export function Sessions() {
    const navigate = useNavigate()
    const { sessions, loading, error, refetch, deleteSession, deleting, pagination, setPage } = useSessions()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const handleSessionClick = (session: Session) => {
        navigate(`/sessions/${session.id}`)
    }

    const handleDelete = async (session: Session) => {
        if (window.confirm(`Tem certeza que deseja excluir a sessão "${session.title}"?`)) {
            await deleteSession(session.id)
        }
    }

    return (
        <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Sessões</h1>
                    <Button
                        text="Criar Sessão"
                        variant="primary"
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar sessões: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <SessionsTable 
                        sessions={sessions} 
                        loading={loading} 
                        onEdit={handleSessionClick}
                        onDelete={handleDelete}
                        deleting={deleting}
                    />
                    <Pagination meta={pagination} loading={loading} onPageChange={setPage} />
                </div>
            </div>

            <CreateSessionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    )
}
