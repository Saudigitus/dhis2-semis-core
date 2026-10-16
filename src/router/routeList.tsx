import Home from "../pages/home";
import { EnrollmentPage } from "dhis2-semis-enrollment";
import { Transfer } from "dhis2-semis-transfer"
import { TransferExecute } from "dhis2-semis-transfer-execute"
import { Performance } from "dhis2-semis-performance"
import { ConfigirationsPage } from "dhis2-semis-configurations";
import i18n from "../locales/index.js";
import { App as AttendancePage } from "dhis2-semis-attendance";
import { FinalResult } from "dhis2-semis-final-result";
import { SchoolCalendar } from "dhis2-semis-school-calendar";
import { App as StudentProfile } from "dhis2-semis-student-profile";
import { useConfig } from "@dhis2/app-runtime";
import { useRecoilValue } from "recoil";
import { UserInfoState } from "dhis2-semis-functions";
import { Navigate } from "react-router-dom";

export default function RouteList() {
    const { baseUrl } = useConfig()
    const userInfo = useRecoilValue(UserInfoState)
    const isSuperUser = userInfo?.authorities?.includes("ALL") ?? false
    const adminOnlyPage = <Navigate to="/semis" replace />
    return [
        {
            path: "/semis",
            component: <Home />
        },
        {
            path: "/semis/enrollments",
            component: <EnrollmentPage i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/attendance",
            component: <AttendancePage i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/performance",
            component: <Performance i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/transfer",
            component: <Transfer i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/transfer-execute",
            component: <TransferExecute i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/final-result",
            component: <FinalResult i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/re-enroll",
            component: <FinalResult i18n={i18n} baseUrl={baseUrl} />
        },
        {
            path: "/semis/configuration/*",
            component: isSuperUser ? <ConfigirationsPage i18n={i18n} baseUrl={baseUrl} /> : adminOnlyPage
        },
        {
            path: "/semis/school-calendar/*",
            component: isSuperUser ? <SchoolCalendar i18n={i18n} baseUrl={baseUrl} /> : adminOnlyPage
        },
        {
            path: "/semis/profile/*",
            component: <StudentProfile i18n={i18n} baseUrl={baseUrl} />
        }
    ];
}
