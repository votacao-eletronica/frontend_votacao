import { Navigate } from "react-router";
import { useLogin } from "../../hooks/auth/useLogin";

type Props = {
    children: React.ReactNode;
};

export function PublicRoute({ children }: Props) {
    const { isAuthenticated } = useLogin();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}