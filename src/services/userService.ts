import type { CreateUser, UpdateUser, User } from '../types/User'
import { createApiInstance } from './httpService'
import type { PaginatedResponse } from '../types/Pagination'

function toFormData(data: CreateUser | UpdateUser, method?: 'PUT') {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined) return

        if (value instanceof File) {
            formData.append(key, value)
            return
        }

        formData.append(key, value === null ? '' : String(value))
    })

    if (method) formData.append('_method', method)

    return formData
}

export const userService = {
    async getUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
        const api = createApiInstance()
        const response = await api.get<PaginatedResponse<User>>('/users', { params: { page, per_page: perPage } })
        return response.data
    },
    async createUser(data: CreateUser) {
        const api = createApiInstance()
        const response = await api.post<{data: User}>('/users', toFormData(data))
        return response.data.data;
    },
    async updateUser(id: number, data: UpdateUser) {
        const api = createApiInstance()
        const response = await api.post<{data: User}>(`/users/${id}`, toFormData(data, 'PUT'))
        return response.data.data;
    },
    async deleteUser(id: number) {
        const api = createApiInstance()
        await api.delete(`/users/${id}`)
    },
}
