import { createBrowserRouter } from "react-router";
import Login from "../views/login";
import { Users } from "../views/users";
import { PrivateRoute } from "../components/auth/privateRoute";
import { PublicRoute } from "../components/auth/publicRoute";


export const router = createBrowserRouter([
    {
        path: "/login",
        Component: () => (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        Component: () => (
            <PrivateRoute>
                <Users />
            </PrivateRoute>
        ),
    },
]);