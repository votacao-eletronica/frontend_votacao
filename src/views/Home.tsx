import { useAuth } from '../hooks/auth/context'
import { CouncilDashboard } from './CouncilDashboard'
import { Users } from './users'

export function Home() {
    const { user } = useAuth()

    return user?.roles.some(role => role.name === 'vereador')
        ? <CouncilDashboard />
        : <Users />
}
