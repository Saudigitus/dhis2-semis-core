import { useLocation } from "react-router-dom"
import { ReactElement, useEffect } from "react"
import { useUrlParams } from "dhis2-semis-functions"
import { useSchoolCalendar, WithPadding } from "dhis2-semis-components"

const LayoutWrapper = ({ children }: { children: ReactElement }) => {
    const { pathname } = useLocation()
    const { add, urlParameters } = useUrlParams()
    const { academicYear, sectionType } = urlParameters()
    const { defaults } = useSchoolCalendar()

    useEffect(() => {
        if (pathname !== "/semis" && sectionType && (!academicYear || academicYear.trim() === "")) {
            setTimeout(() => {
                add("academicYear", defaults?.academicYear)
            }, 50)
        }
    }, [defaults, academicYear, pathname])


    if (!sectionType && (pathname !== "/semis" && pathname !== "/semis/configuration" && pathname !== "/semis/school-calendar")) {
        return (
            <WithPadding style={{ display: "grid", height: "100%", placeItems: "center" }}>
                Can't load the app without section type.
            </WithPadding>
        )
    }

    return (
        <WithPadding p="0">
            {children}
        </WithPadding>
    )
}

export default LayoutWrapper