import { createBrowserRouter } from "react-router";
import Login from "../views/login";
import { Users } from "../views/users";
import { Parties } from "../views/parties";
import { Layout } from "../components/layout/Layout";
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
                <Layout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                Component: Users,
            },
            {
                path: "users",
                Component: Users,
            },
            {
                path: "parties",
                Component: Parties,
            },
        ],
    },
]);