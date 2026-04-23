import { useState } from 'react'
import { useUsers } from '../hooks/users/useUsers'
import { useDeleteUser } from '../hooks/users/useDeleteUser'
import { UserTable } from '../components/users/UserTable'
import { CreateUserModal } from '../components/users/CreateUserModal'
import { UpdateUserModal } from '../components/users/UpdateUserModal'
import { Button } from '../components/form/button'
import type { User } from '../types/User'

export function Users() {
    const { users, loading, error, refetch } = useUsers()
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
        <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                    <Button
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

                <div className="bg-white rounded-lg shadow">
                    <UserTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
                <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
                <UpdateUserModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onSuccess={refetch} user={editingUser} />
            </div>
        </div>
    )
}