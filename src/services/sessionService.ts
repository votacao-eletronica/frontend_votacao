import type { CreateSession, Session } from '../types/Session'
import { createApiInstance } from './httpService'
import type { PaginatedResponse } from '../types/Pagination'
import type { SessionHistory } from '../types/SessionHistory'

export const sessionService = {
    async getSession(sessionId: number): Promise<Session> {
        const api = createApiInstance()
        const response = await api.get<{data: Required<Session>}>(`/sessions/${sessionId}`);
        return response.data.data;
    },
    async getSessions(page = 1, perPage = 10): Promise<PaginatedResponse<Session>> {
        const api = createApiInstance()
        const response = await api.get<PaginatedResponse<Session>>('/sessions', { params: { page, per_page: perPage } });
        return response.data
    },
    async createSession(data: CreateSession) {
        const api = createApiInstance()
        const response = await api.post<{data: Session}>('/sessions', data);
        return response.data.data;
    },
    async deleteSession(sessionId: number): Promise<Session> {
        const api = createApiInstance();
        const response = await api.delete<{data: Session}>(`/sessions/${sessionId}`);
        return response.data.data;
    },
    async openSession(sessionId: number): Promise<Session> {
        const api = createApiInstance()
        const response = await api.patch<{data: Session}>(`/sessions/${sessionId}/open`);
        return response.data.data;
    },
    async closeSession(sessionId: number): Promise<Session> {
        const response = await createApiInstance().patch<{data: Session}>(`/sessions/${sessionId}/close`)
        return response.data.data
    },
    async getHistory(sessionId: number): Promise<SessionHistory> {
        const response = await createApiInstance().get<{data: SessionHistory}>(`/sessions/${sessionId}/history`)
        return response.data.data
    },
    async downloadMinutes(sessionId: number): Promise<void> {
        const response = await createApiInstance().get<Blob>(`/sessions/${sessionId}/minutes.pdf`, { responseType: 'blob' })
        const url = URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = `ata-sessao-${sessionId}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    },
}
