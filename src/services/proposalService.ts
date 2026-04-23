import type { Proposal } from '../types/Proposal'
import { createApiInstance } from './httpService'

export type CreateProposal = Omit<Proposal, 'id' | 'status'>

export const proposalService = {
    async getProposals(): Promise<Proposal[]> {
        const api = createApiInstance()
        const response = await api.get<{data: Proposal[]}>('/propositions')
        return response.data.data;
    },
    async createProposal(data: CreateProposal): Promise<Proposal> {
        const api = createApiInstance()
        const response = await api.post<{data: Proposal}>('/propositions', data)
        return response.data.data;
    },
}
