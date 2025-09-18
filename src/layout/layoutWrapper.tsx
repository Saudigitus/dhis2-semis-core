import { useLocation } from "react-router-dom"
import { ReactElement } from "react"
import { useUrlParams } from "dhis2-semis-functions"
import { WithPadding } from "dhis2-semis-components"

const LayoutWrapper = ({ children }: { children: ReactElement }) => {
    const { pathname } = useLocation()
    const { urlParameters } = useUrlParams()
    const { sectionType } = urlParameters

    if (!sectionType && (pathname !== "/semis" && pathname !== "/semis/configuration" && !pathname.includes('/semis/school-calendar'))) {
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