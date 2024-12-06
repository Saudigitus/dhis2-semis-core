import { Navigate } from "react-router-dom";
import SimpleLayout from "../layout/simpleLayout/simpleLayout";
import WithSideBarLayout from "../layout/sidebarLayout/withSideBarLayout";
import Home from "../pages/home";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/semis" replace />
        },
        {
            path: "/semis",
            layout: WithSideBarLayout,
            component: () => <Home />
        },
        {
            path: "/semis/enrollments",
            layout: WithSideBarLayout,
            component: () => <span>Enrollments</span>
        }
    ]
}