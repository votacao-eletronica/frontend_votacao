import { Plus } from 'phosphor-react'
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
        <div className="listing-page">
            <div className="listing-container">
                <div className="listing-heading">
                    <div><p className="page-eyebrow">Gestão legislativa</p><h1 className="page-title">Sessões</h1><p className="page-description">Organize as sessões e acompanhe suas etapas.</p></div>
                    <Button
                        icon={<Plus size={18} weight="bold" />}
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

                <div className="data-card">
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
