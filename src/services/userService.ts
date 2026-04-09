import type { CreateUser, UpdateUser, User } from '../types/User'
import { createApiInstance } from './httpService'

export const userService = {
    async getUsers(): Promise<User[]> {
        const api = createApiInstance()
        const response = await api.get<{data: User[]}>('/users')
        return response.data.data;
    },
    async createUser(data: CreateUser) {
        const api = createApiInstance()
        const response = await api.post<{data: User}>('/users', data)
        return response.data.data;
    },
    async updateUser(id: number, data: UpdateUser) {
        const api = createApiInstance()
        const response = await api.put<{data: User}>(`/users/${id}`, data)
        return response.data.data;
    },
    async deleteUser(id: number) {
        const api = createApiInstance()
        await api.delete(`/users/${id}`)
    },
}
