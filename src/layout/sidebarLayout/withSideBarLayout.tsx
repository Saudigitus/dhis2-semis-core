import style from "../layout.module.css"
import { Outlet } from "react-router-dom"
import { SideBar } from "dhis2-semis-components"
import { useMenuData } from "../../hooks/menu/useMenuData"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()

    return (
        <div className={style.LayoutContainer}>
            <aside className={style.AsideContainer}>
                <SideBar sideBarBtnPosition="top-offset" collapsed={false} sideBarData={menuData} />
            </aside>
            <main className={style.MainContentContainer}>
                <Outlet />
            </main>
        </div>
    )
}

export default WithSideBarLayout