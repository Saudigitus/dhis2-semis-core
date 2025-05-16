import { useEffect } from "react"
import { useUrlParams } from "dhis2-semis-functions"
import { Outlet, useLocation } from "react-router-dom"
import { useMenuData } from "../hooks/menu/useMenuData"
import { SideBar, SideBarLayout } from "dhis2-semis-components"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()
    const { pathname } = useLocation()
    const { remove } = useUrlParams()

    // useEffect(() => {
    //     if (pathname !== "/semis/transfer") {
    //         remove("position")
    //     }

    //     if (pathname !== "/semis/attendance") {
    //         remove("attendanceMode")
    //         remove("selectedDate")
    //     }
    // }, [pathname])


    return (
        <SideBarLayout
            sidebar={
                <SideBar sideBarBtnPosition="top-offset" collapsed={false} sideBarData={menuData} />
            }
        >
            <Outlet />
        </SideBarLayout>
    )
}

export default WithSideBarLayout