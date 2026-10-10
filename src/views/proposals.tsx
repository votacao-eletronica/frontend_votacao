import { Plus } from 'phosphor-react'
import { useState } from 'react'
import { useProposals } from '../hooks/proposals/useProposals'
import { ProposalTable } from '../components/proposals/ProposalTable'
import { CreateProposalModal } from '../components/proposals/CreateProposalModal'
import { UpdateProposalModal } from '../components/proposals/UpdateProposalModal'
import { ViewProposalModal } from '../components/proposals/ViewProposalModal'
import { Button } from '../components/form/button'
import type { Proposal } from '../types/Proposal'
import { Pagination } from '../components/ui/Pagination'

export function Proposals() {
    const { proposals, loading, error, refetch, pagination, setPage } = useProposals()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const handleEditProposal = (proposal: Proposal) => {
        if (proposal.status.toLowerCase() === 'finalizado') {
            setSelectedProposal(proposal)
            setIsViewModalOpen(true)
            return
        }
        setSelectedProposal(proposal)
        setIsUpdateModalOpen(true)
    }

    const handleViewProposal = (proposal: Proposal) => {
        setSelectedProposal(proposal)
        setIsViewModalOpen(true)
    }

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedProposal(null)
    }

    return (
        <div className="listing-page">
            <div className="listing-container">
                <div className="listing-heading">
                    <div><p className="page-eyebrow">Gestão legislativa</p><h1 className="page-title">Propostas</h1><p className="page-description">Acompanhe e gerencie as propostas legislativas.</p></div>
                    <Button
                        icon={<Plus size={18} weight="bold" />}
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

                <div className="data-card">
                    <ProposalTable
                        proposals={proposals}
                        loading={loading}
                        onEdit={handleEditProposal}
                        onView={handleViewProposal}
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

            <ViewProposalModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false)
                    setSelectedProposal(null)
                }}
                proposal={selectedProposal}
            />
        </div>
    )
}
