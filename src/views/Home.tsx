import { Navigate } from 'react-router'
import { useAuth } from '../hooks/auth/context'
import { homePath } from '../utils/access'
export function Home() {
    const { user } = useAuth()
    return <Navigate to={homePath(user)} replace />
}
