import home from "../../assets/images/sidebar/home.svg"
import gauge from "../../assets/images/sidebar/gauge.svg"
import glyph from "../../assets/images/sidebar/Glyph.svg"
import logOut from "../../assets/images/sidebar/log-out.svg"
import listAdd from "../../assets/images/sidebar/listAdd.svg"
import userGroup from "../../assets/images/sidebar/user-group.svg"
import fileDocument from "../../assets/images/sidebar/file-document.svg"
import { SideBarItemProps } from "dhis2-semis-components/dist/declarations/types/sideBar/SideBarTypes"


export const menuData = (currentAcademicYear: string): SideBarItemProps[] => ([
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
                active: false,
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
                // route: `semis/enrollment`,
                route: "/semis/enrollment",
                appUrl: `#/semis/enrollment?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: glyph,
                displayInMenu: true,
                label: "Attendance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Attendance",
                // route: `attendance?sectionType=student&academicYear=${currentAcademicYear}`,
                route: "/semis/attendance",
                appUrl: `#/semis/attendance?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: fileDocument,
                displayInMenu: true,
                label: "Performance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Performance",
                // route: `performance?sectionType=student&academicYear=${currentAcademicYear}`,
                route: "/semis/performance",
                appUrl: `#/semis/performance?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: gauge,
                displayInMenu: true,
                label: "Final result",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Final-Result",
                // route: `final-result?sectionType=student&academicYear=${currentAcademicYear}`,
                route: "/semis/final-result",
                appUrl: `#/semis/final-result?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: logOut,
                displayInMenu: true,
                label: "Transfer",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Transfer",
                // route: `transfer?sectionType=student&academicYear=${currentAcademicYear}`,
                route: "/semis/transfer",
                appUrl: `#/semis/transfer?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
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
                // route: `enrollment?sectionType=staff&academicYear=${currentAcademicYear}`,
                route: "/semis/enrollment",
                appUrl: `#/semis/enrollment?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: glyph,
                displayInMenu: true,
                label: "Attendance",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Attendance",
                // route: `attendance?sectionType=staff&academicYear=${currentAcademicYear}`,
                route: "/semis/attendance",
                appUrl: `#/semis/attendance?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            },
            {
                icon: logOut,
                displayInMenu: true,
                label: "Transfer",
                badgeInfo: "",
                disabled: false,
                appName: "SEMIS-Transfer",
                // route: `transfer?sectionType=staff&academicYear=${currentAcademicYear}`,
                route: "/semis/transfer",
                appUrl: `#/semis/transfer?sectionType=student&academicYear=${currentAcademicYear}`,
                active: false,
            }
        ]
    }
])