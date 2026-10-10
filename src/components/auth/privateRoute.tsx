import { Navigate, useLocation } from 'react-router'
import { useLogin } from '../../hooks/auth/useLogin'
import { canAccessPath, homePath } from '../../utils/access'
type Props = { children: React.ReactNode }
export function PrivateRoute({ children }: Props) {
    const { isAuthenticated, user, checkingProfile } = useLogin()
    const location = useLocation()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (checkingProfile) return <div className="p-8 text-center text-slate-500" role="status">Carregando seu perfil…</div>
    if (!canAccessPath(user, location.pathname)) return <Navigate to={homePath(user)} replace />
    return children
}
