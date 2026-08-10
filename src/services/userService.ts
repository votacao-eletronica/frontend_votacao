import type { CreateUser, UpdateUser, User } from '../types/User'
import { createApiInstance } from './httpService'
import type { PaginatedResponse } from '../types/Pagination'

export const userService = {
    async getUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
        const api = createApiInstance()
        const response = await api.get<PaginatedResponse<User>>('/users', { params: { page, per_page: perPage } })
        return response.data
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
