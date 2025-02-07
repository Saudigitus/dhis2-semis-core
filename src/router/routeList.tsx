import Home from "../pages/home";
import { EnrollmentPage } from "dhis2-semis-enrollment";

export default function RouteList() {
    return [
        {
            path: "/semis/",
            component: <Home />
        },
        {
            path: "/semis/enrollments",
            component: <EnrollmentPage />
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