import { Check } from 'phosphor-react'
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
    const { sessions } = useSessions(100)
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
        <Modal isOpen={isOpen} onClose={onClose} title="Atualizar Proposta" description="Revise as informações e salve as alterações da proposta.">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Input
                        name="title"
                        label="Título"
                        placeholder="Informe um título claro e objetivo"
                        formRegister={register('title')}
                        caption={errors.title?.message}
                    />
                </div>
                <div className="mb-4">
                    <Select
                        name="voting_session_id"
                        label="Sessão"
                        hint="Opcional. Vincule a proposta a uma sessão legislativa."
                        formRegister={register('voting_session_id', { setValueAs: (value) => value ? Number(value) : undefined })}
                        options={[{ value: '', label: 'Selecione' }, ...sessions.map(session => ({ value: session.id, label: session.title }))]}
                        caption={errors.voting_session_id?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="description"
                        label="Descrição"
                        placeholder="Descreva o conteúdo e os objetivos da proposta…"
                        multiline
                        formRegister={register('description')}
                        caption={errors.description?.message}
                    />
                </div>
                <div className="form-actions">
                    <Button
                        text="Cancelar"
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                    />
                    <Button
                        text="Salvar alterações"
                        icon={<Check size={17} weight="bold" />}
                        isLoading={loading}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    )
}
