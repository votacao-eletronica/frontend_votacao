import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateUsers } from '../../hooks/users/useCreateUser'
import { useUserRoles } from '../../hooks/users/useUserRoles'
import { useParties } from '../../hooks/parties/useParties'
import { Input } from '../form/input'
import { Select } from '../form/Select'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'

const createUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    role_id: z.number().min(1, 'Selecione um papel'),
    party_id: z.number().positive().optional(),
    photo: z.any().optional(),
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
    const { parties } = useParties(100)

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CreateUserForm>({
        resolver: zodResolver(createUserSchema)
    })

    const selectedRoleId = useWatch({ control, name: 'role_id' })
    const selectedRole = roles.find((role) => role.id === selectedRoleId)
    const canHaveCouncilData = ['vereador', 'presidente'].includes(selectedRole?.name ?? '')

    const onSubmit = async (data: CreateUserForm) => {
        const success = await createUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role_id: data.role_id,
            party_id: canHaveCouncilData ? data.party_id : null,
            photo: canHaveCouncilData ? data.photo?.[0] ?? null : null,
        })

        if (!success) return

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
                {canHaveCouncilData && (
                    <>
                        <div className="mb-4">
                            <Input
                                name="photo"
                                label="Foto"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                formRegister={register('photo')}
                                caption={errors.photo?.message?.toString()}
                            />
                            <p className="mt-1 text-xs text-gray-500">JPG, PNG ou WEBP, com até 2MB.</p>
                        </div>
                        <div className="mb-4">
                            <Select
                                name="party_id"
                                label="Partido"
                                formRegister={register('party_id', {
                                    setValueAs: (value) => value ? Number(value) : undefined,
                                })}
                                options={[
                                    { value: '', label: 'Sem filiação' },
                                    ...parties.map((party) => ({ value: party.id, label: `${party.acronym} - ${party.name}` })),
                                ]}
                                caption={errors.party_id?.message}
                            />
                        </div>
                    </>
                )}
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
