import { useLocation } from "react-router-dom"
import { ReactElement, useEffect } from "react"
import { useUrlParams } from "dhis2-semis-functions"
import { useDataStoreKey, WithPadding } from "dhis2-semis-components"

const LayoutWrapper = ({ children }: { children: ReactElement }) => {
    const { pathname } = useLocation()
    const { add, urlParameters } = useUrlParams()
    const { academicYear, sectionType } = urlParameters()
    const { defaults } = useDataStoreKey({ sectionType: sectionType as "staff" | "student" }) ?? []

    useEffect(() => {
        if (pathname !== "/semis" && sectionType) {
            if (!academicYear || academicYear.trim() === "") {
                add("academicYear", defaults?.currentAcademicYear)
            }
        }
    }, [defaults, academicYear])


    if (!sectionType && pathname !== "/semis") {
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