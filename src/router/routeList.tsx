import Home from "../pages/home";
import { EnrollmentsPage } from "dhis-semis-enrollment";

export default function RouteList() {
    return [
        {
            path: "/semis/",
            component: <Home />
        },
        {
            path: "/semis/enrollments",
            component: <EnrollmentsPage />
        },
        {
            path: "/semis/attendance",
            component: <span>Attendance</span>
        },
        {
            path: "/semis/performance",
            component: <span>Performance</span>
        },
        {
            path: "/semis/final-result",
            component: <span>FinalResult</span>
        },
        {
            path: "/semis/transfer",
            component: <span>Transfer</span>
        }
    ]
}