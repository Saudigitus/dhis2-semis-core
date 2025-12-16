import Home from "../pages/home";
import { EnrollmentPage } from "dhis2-semis-enrollment";
import { App as Attendance } from "dhis2-semis-attendance"
import { FinalResult } from "dhis2-semis-final-result"
import { Transfer } from "dhis2-semis-transfer"
import { Performance } from "dhis2-semis-performance"
import { TransferExecute } from "dhis2-semis-transfer-execute"
import { ConfigirationsPage } from "dhis2-semis-configuration";
import { SchoolCalendar } from "dhis2-semis-school-calendar"
import i18n from "../locales/index.js";

export default function RouteList() {
    return [
        {
            path: "/semis",
            component: <Home />
        },
        {
            path: "/semis/enrollments",
            component: <EnrollmentPage i18n={i18n} />
        },
        {
            path: "/semis/attendance",
            component: <Attendance i18n={i18n} />
        },
        {
            path: "/semis/performance",
            component: <Performance i18n={i18n} />
        },
        {
            path: "/semis/transfer",
            component: <Transfer i18n={i18n} />
        },
        {
            path: "/semis/transfer-execute",
            component: <TransferExecute i18n={i18n} />
        },
        {
            path: "/semis/final-result",
            component: <FinalResult i18n={i18n} />
        },
        {
            path: "/semis/re-enroll",
            component: <FinalResult i18n={i18n} />
        },
        {
            path: "/semis/configuration",
            component: <ConfigirationsPage i18n={i18n}/>
        },
        {
            path: "/semis/school-calendar/*",
            component: <SchoolCalendar i18n={i18n} />
        }
    ];
}