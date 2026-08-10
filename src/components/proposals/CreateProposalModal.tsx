import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateProposal } from '../../hooks/proposals/useCreateProposal'
import { Input } from '../form/input'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'
import { Select } from '../form/Select'
import { useSessions } from '../../hooks/sessions/useSessions'

const createProposalSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    voting_session_id: z.number().optional()
})

type CreateProposalForm = z.infer<typeof createProposalSchema>

interface CreateProposalModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateProposalModal({ isOpen, onClose, onSuccess }: CreateProposalModalProps) {
    const { createProposal, loading } = useCreateProposal()
    const { sessions } = useSessions(100);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProposalForm>({
        resolver: zodResolver(createProposalSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })

    const onSubmit = async (data: CreateProposalForm) => {
        await createProposal(data)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Proposta">
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
                        options={[{ value: '', label: 'Selecione' }, ...sessions.map(sessions => ({ value: sessions.id, label: sessions.title }))]}
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
                        text="Criar"
                        isLoading={loading}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    )
}
