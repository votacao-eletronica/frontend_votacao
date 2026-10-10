import { Plus } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateSession } from '../../hooks/sessions/useCreateSession'
import { Input } from '../form/input'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

const createSessionSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    date: z.string().min(1, 'Data é obrigatória'),
})

type CreateSessionForm = z.infer<typeof createSessionSchema>

interface CreateSessionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateSessionModal({ isOpen, onClose, onSuccess }: CreateSessionModalProps) {
    const { createSession, loading } = useCreateSession()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateSessionForm>({
        resolver: zodResolver(createSessionSchema),
        defaultValues: {
            title: '',
            date: '',
        },
    })

    const onSubmit = async (data: CreateSessionForm) => {
        const payload = {
            title: data.title,
            date: data.date,
            status: 'agendada' as const,
        }

        await createSession(payload)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Sessão" description="Defina o título e a data da nova sessão legislativa.">
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
                    <Input
                        name="date"
                        label="Data"
                        type="date"
                        formRegister={register('date')}
                        caption={errors.date?.message}
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
                        text="Criar"
                        icon={<Plus size={17} weight="bold" />}
                        isLoading={loading}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </form>
        </Modal>
    )
}
