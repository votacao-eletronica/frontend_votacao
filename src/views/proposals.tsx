import { useState } from 'react'
import { useProposals } from '../hooks/proposals/useProposals'
import { ProposalTable } from '../components/proposals/ProposalTable'
import { CreateProposalModal } from '../components/proposals/CreateProposalModal'
import { UpdateProposalModal } from '../components/proposals/UpdateProposalModal'
import { Button } from '../components/form/button'
import type { Proposal } from '../types/Proposal'
import { Pagination } from '../components/ui/Pagination'

export function Proposals() {
    const { proposals, loading, error, refetch, pagination, setPage } = useProposals()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)

    const handleEditProposal = (proposal: Proposal) => {
        setSelectedProposal(proposal)
        setIsUpdateModalOpen(true)
    }

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedProposal(null)
    }

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
                    <ProposalTable 
                        proposals={proposals} 
                        loading={loading}
                        onEdit={handleEditProposal}
                    />
                    <Pagination meta={pagination} loading={loading} onPageChange={setPage} />
                </div>
            </div>

            <CreateProposalModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />

            <UpdateProposalModal
                isOpen={isUpdateModalOpen}
                onClose={handleCloseUpdateModal}
                onSuccess={refetch}
                proposal={selectedProposal}
            />
        </div>
    )
}
