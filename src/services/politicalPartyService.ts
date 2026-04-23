import type { PoliticalParty } from '../types/PoliticalParty'
import { createApiInstance } from './httpService'

export type CreatePoliticalParty = Omit<PoliticalParty, 'id'>

export const politicalPartyService = {
    async getParties(): Promise<PoliticalParty[]> {
        const api = createApiInstance()
        const response = await api.get<{data: PoliticalParty[]}>('/parties')
        return response.data.data;
    },
    async createParty(data: CreatePoliticalParty): Promise<PoliticalParty> {
        const api = createApiInstance()
        const response = await api.post<{data: PoliticalParty}>('/parties', data)
        return response.data.data;
    },
}