import { useEffect, useState } from "react"
import type { Role } from "../../types/User"
import { userRoleService } from "../../services/userRolesService"
import { toast } from "react-toastify"

export function useUserRoles () {
        const [roles, setRoles] = useState<Role[]>([])
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)
    
        useEffect(() => {
            const fetchUserRoles = async () => {
                try {
                    setLoading(true)
                    const data = await userRoleService.getRoles()
                    setRoles(data)
                    setError(null)
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar funções dos usuários!'
                    setError(errorMessage)
                    toast.error(errorMessage)
                } finally {
                    setLoading(false)
                }
            }
    
            fetchUserRoles()
        }, [])
    
        return { roles, loading, error }
    
}