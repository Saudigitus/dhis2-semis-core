import style from "../layout.module.css"
import { Outlet } from "react-router-dom"
import { SideBar } from "dhis2-semis-components"
import { sideBarData } from "../../utils/constants/menuData"

const WithSideBarLayout = () => {
    return (
        <div className={style.LayoutContainer}>
            <aside className={style.AsideContainer}>
                <SideBar sideBarData={sideBarData("2024")} />
            </aside>
            <main className={style.MainContentContainer}>
                <Outlet/>
            </main>
        </div>
    )
}

export default WithSideBarLayout