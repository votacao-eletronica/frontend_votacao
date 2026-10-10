import type { User } from '../types/User'
export const isCouncilMember = (user: User | null) => user?.roles?.some(role => role.name === 'vereador') ?? false
export const isStaff = (user: User | null) => !isCouncilMember(user) && (user?.roles?.some(role => ['admin', 'presidente', 'secretario'].includes(role.name)) ?? false)
export const homePath = (user: User | null) => isCouncilMember(user) ? '/council' : isStaff(user) ? '/users' : '/access-denied'
export function canAccessPath(user: User | null, path: string) {
    if (path === '/' || path === '/access-denied') return true
    if (isCouncilMember(user)) return path === '/council' || path === '/council/history' || /^\/council\/sessions\/\d+$/.test(path) || /^\/sessions\/\d+\/history$/.test(path)
    if (!isStaff(user)) return false
    if (path.startsWith('/council')) return false
    if (path === '/chamber') return user?.roles.some(role => role.name === 'admin') ?? false
    return true
}
