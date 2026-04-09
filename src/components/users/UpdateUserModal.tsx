import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateUser } from '../../hooks/users/useUpdateUser'
import { useUserRoles } from '../../hooks/users/useUserRoles'
import { Input } from '../form/input'
import { Select } from '../form/Select'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'
import type { User } from '../../types/User'

const updateUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').optional(),
    email: z.email('Email inválido').optional(),
    role_id: z.number().min(1, 'Selecione um papel').optional(),
}).refine((data) => data.name || data.email || data.role_id !== undefined, {
    message: 'Pelo menos um campo deve ser preenchido',
    path: ['name'],
})

type UpdateUserForm = z.infer<typeof updateUserSchema>

interface UpdateUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    user: User | null
}

export function UpdateUserModal({ isOpen, onClose, onSuccess, user }: UpdateUserModalProps) {
    const { updateUser, loading } = useUpdateUser()
    const { roles } = useUserRoles()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateUserForm>({
        resolver: zodResolver(updateUserSchema)
    })

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                role_id: user.roles[0]?.id,
            })
        }
    }, [user, reset])

    const onSubmit = async (data: UpdateUserForm) => {
        if (!user) return
        await updateUser(user.id, data)
        reset()
        onSuccess()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Atualizar Usuário">
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