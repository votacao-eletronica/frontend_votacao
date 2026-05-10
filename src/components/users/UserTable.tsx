import type { User } from '../../types/User'
import { PencilSimple } from 'phosphor-react'
import { IconButton } from '../form/IconButton'

type UserTableProps = {
    users: User[]
    loading?: boolean
    onEdit?: (user: User) => void
    onDelete?: (userId: number) => void
}

export function UserTable({ users, loading, onEdit }: UserTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Carregando usuários...</p>
            </div>
        )
    }

    if (users.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Funções</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm text-gray-900">{user.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-3 text-sm">
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.map((role) => (
                                        <span
                                            key={role.id}
                                            className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold"
                                        >
                                            {role.name}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-3 text-sm">
                                <div className="flex gap-2">
                                    <IconButton
                                        icon={<PencilSimple size={20} />}
                                        onClick={() => onEdit?.(user)}
                                        title="Editar usuário"
                                        variant='primary'
                                    />
                                    {/* <IconButton
                                        icon={<Trash size={20} />}
                                        onClick={() => onDelete?.(user.id)}
                                        title="Deletar usuário"
                                        variant="danger"
                                    /> */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
