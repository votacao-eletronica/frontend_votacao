import { Plus } from 'phosphor-react'
import { useState } from 'react'
import { useUsers } from '../hooks/users/useUsers'
import { useDeleteUser } from '../hooks/users/useDeleteUser'
import { UserTable } from '../components/users/UserTable'
import { CreateUserModal } from '../components/users/CreateUserModal'
import { UpdateUserModal } from '../components/users/UpdateUserModal'
import { Button } from '../components/form/button'
import type { User } from '../types/User'
import { Pagination } from '../components/ui/Pagination'

export function Users() {
    const { users, loading, error, refetch, pagination, setPage } = useUsers()
    const { deleteUser } = useDeleteUser()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setIsUpdateModalOpen(true)
    }

    const handleDelete = async (userId: number) => {
        await deleteUser(userId)
        refetch()
    }

    return (
        <div className="listing-page">
            <div className="listing-container">
                <div className="listing-heading">
                    <div><p className="page-eyebrow">Gestão legislativa</p><h1 className="page-title">Usuários</h1><p className="page-description">Gerencie os usuários, suas funções e filiações partidárias.</p></div>
                    <Button
                        icon={<Plus size={18} weight="bold" />}
                        text="Criar Usuário"
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar usuários: {error}</p>
                    </div>
                )}

                <div className="data-card">
                    <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
                    <Pagination meta={pagination} loading={loading} onPageChange={setPage} />
                </div>
                <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
                <UpdateUserModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onSuccess={refetch} user={editingUser} />
            </div>
        </div>
    )
}
