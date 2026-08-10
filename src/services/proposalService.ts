import type { Proposal } from '../types/Proposal'
import { createApiInstance } from './httpService'
import type { PaginatedResponse } from '../types/Pagination'

export type CreateProposal = Omit<Proposal, 'id' | 'status' | 'voting_session'> & {
    voting_session_id?: number
}

export type UpdateProposal = Omit<Proposal, 'status' | 'voting_session'> & {
    voting_session_id?: number
}

export const proposalService = {
    async getProposals(page = 1, perPage = 10): Promise<PaginatedResponse<Proposal>> {
        const api = createApiInstance()
        const response = await api.get<PaginatedResponse<Proposal>>('/propositions', { params: { page, per_page: perPage } })
        return response.data
    },
    async createProposal(data: CreateProposal): Promise<Proposal> {
        const api = createApiInstance()
        const response = await api.post<{data: Proposal}>('/propositions', data)
        return response.data.data;
    },
    async updateProposal(data: UpdateProposal): Promise<Proposal> {
        const {id: proposalId, ...updatedData} = data;
        const api = createApiInstance()
        const response = await api.put<{data: Proposal}>(`/propositions/${proposalId}`, updatedData)
        return response.data.data;
    },
}
