import { useState } from 'react'
import { useUsers } from '../hooks/users/useUsers'
import { UserTable } from '../components/users/UserTable'
import { CreateUserModal } from '../components/users/CreateUserModal'

export function Users() {
    const { users, loading, error, refetch } = useUsers()
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                    <p className="mt-2 text-gray-600">Listagem de todos os usuários do sistema</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Criar Usuário</button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar usuários: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <UserTable users={users} loading={loading} />
                </div>
                <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refetch} />
            </div>
        </div>
    )
}