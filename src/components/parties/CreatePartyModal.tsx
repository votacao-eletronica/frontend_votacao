import { Plus } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateParty } from '../../hooks/parties/useCreateParty'
import { Input } from '../form/input'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

const createPartySchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    acronym: z.string().min(1, 'Sigla é obrigatória'),
    logo: z.string().url('URL de logo inválida').optional().or(z.literal('')),
})

type CreatePartyForm = z.infer<typeof createPartySchema>

interface CreatePartyModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreatePartyModal({ isOpen, onClose, onSuccess }: CreatePartyModalProps) {
    const { createParty, loading } = useCreateParty()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreatePartyForm>({
        resolver: zodResolver(createPartySchema),
        defaultValues: {
            name: '',
            acronym: '',
            logo: '',
        },
    })

    const onSubmit = async (data: CreatePartyForm) => {
        const payload = {
            name: data.name,
            acronym: data.acronym,
            logo: data.logo || null,
        }

        await createParty(payload)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Partido Político" description="Informe os dados de identificação do partido político.">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Input
                        name="name"
                        label="Nome"
                        placeholder="Informe o nome completo"
                        formRegister={register('name')}
                        caption={errors.name?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="acronym"
                        label="Sigla"
                        placeholder="Ex.: PT, MDB, PSD"
                        formRegister={register('acronym')}
                        caption={errors.acronym?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="logo"
                        label="URL do Logo"
                        placeholder="https://exemplo.com/logo.png"
                        formRegister={register('logo')}
                        caption={errors.logo?.message}
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
