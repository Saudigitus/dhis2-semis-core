import { Navigate } from "react-router-dom";
import { TableComponent } from "../../pages";
import SimpleLayout from "../layout/simpleLayout/simpleLayout";
import WithSideBarLayout from "../layout/sidebarLayout/withSideBarLayout";
import Enrollment from "../pages/enrollment";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/enrollment" replace />
        },
        {
            path: "/enrollment",
            layout: WithSideBarLayout,
            component: () => <Enrollment />
        }
    ]
}