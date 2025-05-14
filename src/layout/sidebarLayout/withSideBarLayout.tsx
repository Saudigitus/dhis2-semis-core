import { Outlet } from "react-router-dom"
import { useMenuData } from "../../hooks/menu/useMenuData"
import { SideBar, SideBarLayout } from "dhis2-semis-components"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()

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