import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateProposal } from '../../hooks/proposals/useCreateProposal'
import { Input } from '../form/input'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

const createProposalSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
})

type CreateProposalForm = z.infer<typeof createProposalSchema>

interface CreateProposalModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateProposalModal({ isOpen, onClose, onSuccess }: CreateProposalModalProps) {
    const { createProposal, loading } = useCreateProposal()
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
