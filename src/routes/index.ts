import { createBrowserRouter } from "react-router";
import Login from "../views/login";
import { Users } from "../views/users";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Login,
    },
    {
        path: "/users",
        Component: Users,
    },
]);
