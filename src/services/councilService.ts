import type { ClosedCouncilSession, CouncilSession, OpenCouncilSession, PresentationSession, VotingChoice } from '../types/Council'
import type { PaginatedResponse } from '../types/Pagination'
import { createApiInstance } from './httpService'

export const councilService = {
    async getOpenSessions(): Promise<OpenCouncilSession[]> {
        const response = await createApiInstance().get<{ data: OpenCouncilSession[] }>('/council/sessions/open')
        return response.data.data
    },

    async getHistory(page = 1): Promise<PaginatedResponse<ClosedCouncilSession>> {
        const response = await createApiInstance().get<PaginatedResponse<ClosedCouncilSession>>('/council/sessions/history', { params: { page } })
        return response.data
    },

    async getSession(sessionId: number): Promise<CouncilSession> {
        const response = await createApiInstance().get<{ data: CouncilSession }>(`/council/sessions/${sessionId}`)
        return response.data.data
    },

    async getPresentation(sessionId: number): Promise<PresentationSession> {
        const response = await createApiInstance().get<{ data: PresentationSession }>(`/sessions/${sessionId}/presentation`)
        return response.data.data
    },

    async enterSession(sessionId: number): Promise<void> {
        await createApiInstance().post(`/council/sessions/${sessionId}/enter`)
    },

    async castVote(propositionId: number, vote: VotingChoice): Promise<void> {
        await createApiInstance().post(`/council/propositions/${propositionId}/vote`, { vote })
    },

    async requestSpeech(sessionId: number): Promise<void> {
        await createApiInstance().post(`/council/sessions/${sessionId}/request-speech`)
    },
}
