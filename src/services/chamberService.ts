import type { Chamber } from '../types/Chamber'
import { createApiInstance } from './httpService'

export const chamberService = {
    async branding(): Promise<Pick<Chamber, 'name' | 'coat_of_arms'>> {
        const response = await createApiInstance().get<{ data: Pick<Chamber, 'name' | 'coat_of_arms'> }>('/chamber/branding')
        return response.data.data
    },

    async get(): Promise<Chamber> {
        const response = await createApiInstance().get<{ data: Chamber }>('/chamber')
        return response.data.data
    },

    async update(name: string, coatOfArms?: File): Promise<Chamber> {
        const data = new FormData()
        data.append('name', name)
        if (coatOfArms) data.append('coat_of_arms', coatOfArms)

        const response = await createApiInstance().post<{ data: Chamber }>('/chamber', data)
        return response.data.data
    },
}
