import { useState } from 'react'
import { useProposals } from '../hooks/proposals/useProposals'
import { ProposalTable } from '../components/proposals/ProposalTable'
import { CreateProposalModal } from '../components/proposals/CreateProposalModal'
import { Button } from '../components/form/button'

export function Proposals() {
    const { proposals, loading, error, refetch } = useProposals()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <div className="h-full bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Propostas</h1>
                    <Button
                        text="Criar Proposta"
                        variant="primary"
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        <p className="text-sm font-medium">Erro ao carregar propostas: {error}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow">
                    <ProposalTable proposals={proposals} loading={loading} />
                </div>
            </div>

            <CreateProposalModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div>
    )
}
