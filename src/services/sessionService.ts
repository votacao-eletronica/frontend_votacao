import type { CreateSession, Session } from '../types/Session'
import { createApiInstance } from './httpService'

export const sessionService = {
    async getSession(sessionId: number): Promise<Session> {
        const api = createApiInstance()
        const response = await api.get<{data: Required<Session>}>(`/sessions/${sessionId}`);
        return response.data.data;
    },
    async getSessions(): Promise<Session[]> {
        const api = createApiInstance()
        const response = await api.get<{data: Session[]}>('/sessions');
        return response.data.data;
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
}
