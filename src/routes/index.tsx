import { createBrowserRouter } from "react-router";
import Login from "../views/login";
import { Users } from "../views/users";
import { Parties } from "../views/parties";
import { Proposals } from "../views/proposals";
import { Sessions } from "../views/sessions";
import { SessionDetail } from "../views/SessionDetail";
import { Layout } from "../components/layout/Layout";
import { PrivateRoute } from "../components/auth/privateRoute";
import { PublicRoute } from "../components/auth/publicRoute";
import { CouncilDashboard } from "../views/CouncilDashboard";
import { VotingRoom } from "../views/VotingRoom";
import { Home } from "../views/Home";
import { SessionHistory } from "../views/SessionHistory";
import { CouncilHistory } from "../views/CouncilHistory";


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
        path: "/council/sessions/:id",
        Component: () => (
            <PrivateRoute>
                <VotingRoom />
            </PrivateRoute>
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
                Component: Home,
            },
            {
                path: "users",
                Component: Users,
            },
            {
                path: "parties",
                Component: Parties,
            },
            {
                path: "proposals",
                Component: Proposals,
            },
            {
                path: "sessions",
                Component: Sessions,
            },
            {
                path: "sessions/:id",
                Component: SessionDetail,
            },
            {
                path: "sessions/:id/history",
                Component: SessionHistory,
            },
            {
                path: "council",
                Component: CouncilDashboard,
            },
            {
                path: "council/history",
                Component: CouncilHistory,
            },
        ],
    },
]);
