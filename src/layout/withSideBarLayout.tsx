import { Outlet } from "react-router-dom"
import LayoutWrapper from "./layoutWrapper"
import { useMenuData } from "../hooks/menu/useMenuData"
import { SideBar, SideBarLayout } from "dhis2-semis-components"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()

    return (
        <SideBarLayout
            sidebar={
                <SideBar
                    collapsed={false}
                    sideBarData={menuData}
                    sideBarBtnPosition="top-offset"
                />
            }
        >
            <LayoutWrapper>
                <Outlet />
            </LayoutWrapper>
        </SideBarLayout>
    )
}

export default WithSideBarLayout