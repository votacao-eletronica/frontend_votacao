import type { PoliticalParty } from '../types/PoliticalParty'
import { createApiInstance } from './httpService'
import type { PaginatedResponse } from '../types/Pagination'

export type CreatePoliticalParty = Omit<PoliticalParty, 'id'>

export const politicalPartyService = {
    async getParties(page = 1, perPage = 10): Promise<PaginatedResponse<PoliticalParty>> {
        const api = createApiInstance()
        const response = await api.get<PaginatedResponse<PoliticalParty>>('/parties', { params: { page, per_page: perPage } })
        return response.data
    },
    async createParty(data: CreatePoliticalParty): Promise<PoliticalParty> {
        const api = createApiInstance()
        const response = await api.post<{data: PoliticalParty}>('/parties', data)
        return response.data.data;
    },
}
