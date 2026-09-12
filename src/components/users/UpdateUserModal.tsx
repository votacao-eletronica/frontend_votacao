import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateUser } from '../../hooks/users/useUpdateUser'
import { useUserRoles } from '../../hooks/users/useUserRoles'
import { useParties } from '../../hooks/parties/useParties'
import { Input } from '../form/input'
import { Select } from '../form/Select'
import { Button } from '../form/button'
import { Modal } from '../ui/Modal'
import type { User } from '../../types/User'

const updateUserSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório').optional(),
    email: z.email('Email inválido').optional(),
    role_id: z.number().min(1, 'Selecione um papel').optional(),
    party_id: z.number().positive().nullable().optional(),
    photo: z.any().optional(),
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
    const { parties } = useParties(100)

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<UpdateUserForm>({
        resolver: zodResolver(updateUserSchema)
    })

    const selectedRoleId = useWatch({ control, name: 'role_id' })
    const selectedRole = roles.find((role) => role.id === selectedRoleId)
    const canHaveCouncilData = ['vereador', 'presidente'].includes(selectedRole?.name ?? '')

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                role_id: user.roles[0]?.id,
                party_id: user.current_party?.id ?? null,
                photo: undefined,
            })
        }
    }, [user, reset])

    const onSubmit = async (data: UpdateUserForm) => {
        if (!user) return
        const success = await updateUser(user.id, {
            name: data.name,
            email: data.email,
            role_id: data.role_id,
            party_id: canHaveCouncilData ? data.party_id : null,
            photo: canHaveCouncilData ? data.photo?.[0] ?? undefined : undefined,
        })

        if (!success) return

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
                {canHaveCouncilData && (
                    <>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Foto</label>
                            {user?.photo && (
                                <img
                                    src={user.photo}
                                    alt={`Foto atual de ${user.name}`}
                                    className="my-2 h-20 w-20 rounded-full object-cover"
                                />
                            )}
                            <Input
                                name="photo"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                formRegister={register('photo')}
                                caption={errors.photo?.message?.toString()}
                            />
                            <p className="mt-1 text-xs text-gray-500">Selecione um arquivo somente para trocar a foto atual.</p>
                        </div>
                        <div className="mb-4">
                            <Select
                                name="party_id"
                                label="Partido atual"
                                formRegister={register('party_id', {
                                    setValueAs: (value) => value ? Number(value) : null,
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
                {user && user.party_history.length > 0 && (
                    <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-3">
                        <h3 className="mb-2 text-sm font-semibold text-gray-800">Histórico de partidos</h3>
                        <div className="space-y-2">
                            {user.party_history.map((membership) => (
                                <div key={membership.id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-medium text-gray-800">
                                        {membership.party?.acronym ?? 'Partido removido'}
                                    </span>
                                    <span className="text-gray-600">
                                        {new Date(`${membership.start_date}T00:00:00`).toLocaleDateString('pt-BR')}
                                        {' até '}
                                        {membership.end_date
                                            ? new Date(`${membership.end_date}T00:00:00`).toLocaleDateString('pt-BR')
                                            : 'atual'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
