import Home from "../pages/home";
import { EnrollmentPage } from "dhis2-semis-enrollment";
import { App as Attendance } from "dhis2-semis-attendance"
import { FinalResult } from "dhis2-semis-final-result"
import { Transfer } from "dhis2-semis-transfer"
import { Reenrollment } from "dhis2-semis-staff-reenroll"
import { Performance } from "dhis2-semis-performance"
import { EnrollmentPage as TransferExecute } from "dhis2-semis-transfer-execute"

export default function RouteList() {
    return [
        {
            path: "/semis",
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
            component: <Performance/>
        },
        {
            path: "/semis/transfer",
            component: <Transfer />
        },
        {
            path: "/semis/transfer-execute",
            component: <TransferExecute />
        },
        {
            path: "/semis/final-result",
            component: <FinalResult />
        },
        {
            path: "/semis/re-enroll",
            component: <Reenrollment />
        }
    ];
}