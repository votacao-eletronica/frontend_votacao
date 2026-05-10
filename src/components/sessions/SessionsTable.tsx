import type { Session } from '../../types/Session'
import { IconButton } from '../form/IconButton'
import { Trash } from 'phosphor-react'

type SessionsTableProps = {
    sessions: Session[]
    loading?: boolean
    onSessionClick?: (session: Session) => void
    onDelete?: (session: Session) => void
    deleting?: boolean
}

export function SessionsTable({ sessions, loading, onSessionClick, onDelete, deleting }: SessionsTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Carregando sessões...</p>
            </div>
        )
    }

    if (sessions.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Nenhuma sessão encontrada</p>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'agendada':
                return 'bg-blue-100 text-blue-800'
            case 'aberta':
                return 'bg-green-100 text-green-800'
            case 'fechada':
                return 'bg-gray-100 text-gray-800'
            case 'cancelada':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aberto em</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fechado em</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((session) => (
                        <tr
                            key={session.id}
                            className={`border-b border-gray-300 hover:bg-gray-50 ${onSessionClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onSessionClick?.(session)}
                        >
                            <td className="px-6 py-3 text-sm text-gray-900">{session.title}</td>
                            <td className="px-6 py-3 text-sm text-gray-600">{formatDate(session.date)}</td>
                            <td className="px-6 py-3 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                                    {session.status}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                                {session.opened_at ? formatDate(session.opened_at) : '-'}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                                {session.closed_at ? formatDate(session.closed_at) : '-'}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                                <div className="flex gap-2">
                                    {onDelete && (
                                        <IconButton
                                            icon={<Trash size={16} />}
                                            variant="danger"
                                            title="Excluir sessão"
                                            onClick={(e: any) => {
                                                e.stopPropagation()
                                                onDelete(session)
                                            }}
                                            disabled={deleting}
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
