import type { Proposal } from '../../types/Proposal'
import { IconButton } from '../form/IconButton'
import { PencilSimple } from 'phosphor-react'

type ProposalTableProps = {
    proposals: Proposal[]
    loading?: boolean
    onEdit?: (proposal: Proposal) => void
}

export function ProposalTable({ proposals, loading, onEdit }: ProposalTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Carregando propostas...</p>
            </div>
        )
    }

    if (proposals.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Nenhuma proposta encontrada</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {proposals.map((proposal) => (
                        <tr key={proposal.id} className="border-b border-gray-300 hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm text-gray-900 font-medium">{proposal.title}</td>
                            <td className="px-6 py-3 text-sm text-gray-600">{proposal.description}</td>
                            <td className="px-6 py-3 text-sm">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {proposal.status}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600">
                                {onEdit && (
                                    <IconButton
                                        icon={<PencilSimple size={20} />}
                                        variant="primary"
                                        title="Editar proposta"
                                        onClick={(e: any) => {
                                            e.stopPropagation()
                                            onEdit(proposal)
                                        }}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
