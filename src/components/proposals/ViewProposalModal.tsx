import type { Proposal } from '../../types/Proposal'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

type ViewProposalModalProps = {
    isOpen: boolean
    onClose: () => void
    proposal: Proposal | null
}

export function ViewProposalModal({ isOpen, onClose, proposal }: ViewProposalModalProps) {
    if (!proposal) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visualizar Proposta">
            <div className="space-y-5">
                <div>
                    <p className="text-sm font-medium text-gray-500">Título</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{proposal.title}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Descrição</p>
                    <p className="mt-1 whitespace-pre-wrap text-gray-800">{proposal.description}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className="mt-1 inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold capitalize text-gray-700">{proposal.status}</span>
                </div>
                <div className="flex justify-end">
                    <Button text="Fechar" variant="secondary" type="button" onClick={onClose} />
                </div>
            </div>
        </Modal>
    )
}
