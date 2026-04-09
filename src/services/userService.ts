import type { User } from '../types/User'
import { createApiInstance } from './httpService'

export const userService = {
    async getUsers(): Promise<User[]> {
        const api = createApiInstance()
        const response = await api.get<{data: User[]}>('/users')
        return response.data.data;
    },
}
