import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProposal } from '../../hooks/proposals/useUpdateProposal'
import { Input } from '../form/input'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'
import { Select } from '../form/Select'
import { useSessions } from '../../hooks/sessions/useSessions'
import type { Proposal } from '../../types/Proposal'

const updateProposalSchema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    voting_session_id: z.number().optional()
})

type UpdateProposalForm = z.infer<typeof updateProposalSchema>

interface UpdateProposalModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    proposal: Proposal | null
}

export function UpdateProposalModal({ isOpen, onClose, onSuccess, proposal }: UpdateProposalModalProps) {
    const { updateProposal, loading } = useUpdateProposal()
    const { sessions } = useSessions()
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UpdateProposalForm>({
        resolver: zodResolver(updateProposalSchema),
        defaultValues: {
            id: proposal?.id,
            title: proposal?.title || '',
            description: proposal?.description || '',
            voting_session_id: proposal?.voting_session.id ?? undefined,
        },
    })

    useEffect(() => {
        if (proposal && isOpen) {
            setValue('id', proposal.id)
            setValue('title', proposal.title)
            setValue('description', proposal.description)
            setValue('voting_session_id', proposal.voting_session.id ?? undefined)
        }
    }, [proposal, isOpen, setValue])

    const onSubmit = async (data: UpdateProposalForm) => {
        await updateProposal(data)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Atualizar Proposta">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Input
                        name="title"
                        label="Título"
                        formRegister={register('title')}
                        caption={errors.title?.message}
                    />
                </div>
                <div className="mb-4">
                    <Select
                        name="voting_session_id"
                        label="Sessão"
                        formRegister={register('voting_session_id', { valueAsNumber: true })}
                        options={[{ value: '', label: 'Selecione' }, ...sessions.map(session => ({ value: session.id, label: session.title }))]}
                        caption={errors.voting_session_id?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="description"
                        label="Descrição"
                        multiline
                        formRegister={register('description')}
                        caption={errors.description?.message}
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        text="Cancelar"
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                    />
                    <Button
                        text="Atualizar"
                        isLoading={loading}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    )
}
