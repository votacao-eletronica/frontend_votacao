import { useState } from 'react'
import { useUsers } from '../hooks/users/useUsers'
import { UserTable } from '../components/users/UserTable'
import { CreateUserModal } from '../components/users/CreateUserModal'
import { UpdateUserModal } from '../components/users/UpdateUserModal'
import type { User } from '../types/User'

export function Users() {
    const { users, loading, error, refetch } = useUsers()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setIsUpdateModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                    <p className="mt-2 text-gray-600">Listagem de todos os usuários do sistema</p>
                    <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Criar Usuário</button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar usuários: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <UserTable users={users} loading={loading} onEdit={handleEdit} />
                </div>
                <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={refetch} />
                <UpdateUserModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onSuccess={refetch} user={editingUser} />
            </div>
        </div>
    )
}