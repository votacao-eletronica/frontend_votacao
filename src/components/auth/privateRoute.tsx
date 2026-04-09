import { Navigate } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";

type Props = {
    children: React.ReactNode;
};

export function PrivateRoute({ children }: Props) {
    const {isAuthenticated} = useLogin();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}