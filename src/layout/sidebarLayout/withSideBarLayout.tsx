import { LayoutProps } from "../../types/layout/layoutProps"
import style from "../layout.module.css"

const WithSideBarLayout = ({ children }: LayoutProps) => {
    return (
        <div className={style.LayoutContainer}>
            <aside className={style.AsideContainer}>
                Side Bar
            </aside>
            <main className={style.MainContentContainer}>
                {children}
            </main>
        </div>
    )
}

export default WithSideBarLayout