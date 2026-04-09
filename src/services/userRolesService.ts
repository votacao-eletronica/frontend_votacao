import type { Role } from '../types/User'
import { createApiInstance } from './httpService'

export const userRoleService = {
    async getRoles(): Promise<Role[]> {
        const api = createApiInstance()
        const response = await api.get<{data: Role[]}>('/roles')
        return response.data.data;
    }
}
