import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateUsers } from '../../hooks/users/useCreateUser'
import { useUserRoles } from '../../hooks/users/useUserRoles'
import { Input } from '../form/input'
import { Select } from '../form/Select'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

const createUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    role_id: z.number().min(1, 'Selecione um papel'),
})

type CreateUserForm = z.infer<typeof createUserSchema>

interface CreateUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
    const { createUser, loading } = useCreateUsers()
    const { roles } = useUserRoles()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema)
    })

    const onSubmit = async (data: CreateUserForm) => {
        await createUser(data)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Criar Usuário">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <Input
                        name="name"
                        label="Nome"
                        formRegister={register('name')}
                        caption={errors.name?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="email"
                        label="Email"
                        type="email"
                        formRegister={register('email')}
                        caption={errors.email?.message}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        name="password"
                        label="Senha"
                        type="password"
                        formRegister={register('password')}
                        caption={errors.password?.message}
                    />
                </div>
                <div className="mb-4">
                    <Select
                        name="role_id"
                        label="Papel"
                        formRegister={register('role_id', { valueAsNumber: true })}
                        options={[{ value: '', label: 'Selecione' }, ...roles.map(role => ({ value: role.id, label: role.name }))]}
                        caption={errors.role_id?.message}
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