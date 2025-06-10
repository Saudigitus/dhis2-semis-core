import { NavigateFunction } from "react-router-dom"
import home from "../../../assets/images/sidebar/home.svg"
import gauge from "../../../assets/images/sidebar/gauge.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import { SideBarItemProps } from "dhis2-semis-components/dist/declarations/types/sideBar/SideBarTypes"
import { DataStoreProps } from "dhis2-semis-types"
import { subItemRoute } from "../../common/menu/subItemRoute"

type menuDataParams = {
    pathname: string, navigate: NavigateFunction, locationParams: string, filterDataElements: DataStoreProps[0]["filters"]
}

export const menuData = ({ pathname, navigate, locationParams, filterDataElements }: menuDataParams): SideBarItemProps[] => ([
    {
        title: "Navigation",
        displayInMenu: true,
        subItems: [
            {
                icon: home,
                displayInMenu: true,
                label: "Home",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS",
                route: `/semis`,
                appUrl: "#/semis",
                active: true,
                action: () => navigate("/semis")
            }
        ]
    },
    {
        title: "Student",
        displayInMenu: true,
        subItems: [
            {
                icon: listAdd,
                displayInMenu: true,
                label: "Enrollment",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Enrollment",
                route: "/semis/enrollments",
                appUrl: `#/semis/enrollments`,
                active: false,
                action: () => navigate(`/semis/enrollments?${subItemRoute(locationParams, 'student', filterDataElements, pathname)}`)
            },
            {
                icon: glyph,
                displayInMenu: true,
                label: "Attendance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Attendance",
                route: "/semis/attendance",
                appUrl: `#/semis/attendance`,
                active: true,
                action: () => navigate(`/semis/attendance?${subItemRoute(locationParams, 'student', filterDataElements, pathname)}`)
            },
            {
                icon: fileDocument,
                displayInMenu: true,
                label: "Performance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Performance",
                route: "/semis/performance",
                appUrl: `#/semis/performance`,
                active: false,
                action: () => navigate(`/semis/performance?${subItemRoute(locationParams, 'student', filterDataElements, pathname)}`)
            },
            {
                icon: gauge,
                displayInMenu: true,
                label: "Final result",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Final-Result",
                route: "/semis/final-result",
                appUrl: `#/semis/final-result`,
                active: false,
                action: () => navigate(`/semis/final-result?${subItemRoute(locationParams, 'student', filterDataElements, pathname)}`)
            },
            {
                icon: logOut,
                displayInMenu: true,
                label: "Transfer",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Transfer",
                route: "/semis/transfer",
                appUrl: `#/semis/transfer`,
                active: false,
                action: () => navigate(`/semis/transfer?${subItemRoute(locationParams, 'student', filterDataElements, pathname)}`)
            }
        ]
    },
    {
        title: "Staff",
        displayInMenu: true,
        subItems: [
            {
                icon: userGroup,
                displayInMenu: true,
                label: "Staff registry",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Enrollment",
                route: "/semis/enrollments",
                appUrl: `#/semis/enrollments`,
                active: false,
                action: () => navigate(`/semis/enrollments?${subItemRoute(locationParams, 'staff', filterDataElements, pathname)}`)
            },
            {
                icon: glyph,
                displayInMenu: true,
                label: "Attendance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Attendance",
                route: "/semis/attendance",
                appUrl: `#/semis/attendance`,
                active: false,
                action: () => navigate(`/semis/attendance?${subItemRoute(locationParams, 'staff', filterDataElements, pathname)}`)
            },
            {
                icon: logOut,
                displayInMenu: true,
                label: "Transfer",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Transfer",
                route: "/semis/transfer",
                appUrl: `#/semis/transfer`,
                active: false,
                action: () => navigate(`/semis/transfer?${subItemRoute(locationParams, 'staff', filterDataElements, pathname)}`)
            },
            {
                icon: gauge,
                displayInMenu: true,
                label: "Staff Re-enroll",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-re-enroll",
                route: "/semis/re-enroll",
                appUrl: `#/semis/re-enroll`,
                active: false,
                action: () => navigate(`/semis/re-enroll?${subItemRoute(locationParams, 'staff', filterDataElements, pathname)}`)
            },
        ]
    }
])