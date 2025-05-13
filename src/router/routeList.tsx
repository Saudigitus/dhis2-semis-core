import Home from "../pages/home";
import { EnrollmentPage } from "dhis2-semis-enrollment";
import { App as Attendance } from "dhis2-semis-attendance"
import { FinalResult } from "dhis2-semis-final-result"
import { Transfer } from "dhis2-semis-transfer"

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
            component: <Attendance />
        },
        {
            path: "/semis/performance",
            component: <></>
        },
        {
            path: "/semis/transfer",
            component: <Transfer />
        },
        {
            path: "/semis/final-result",
            component: <FinalResult />
        }
    ];
}