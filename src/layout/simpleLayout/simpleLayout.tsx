import style from "../layout.module.css"
import { LayoutProps } from '../../types/layout/layoutProps';

export default function SimpleLayout({ children }: LayoutProps) {
    return (
        <div className={style.LayoutContainer}>
            <main className={style.MainContentContainer}>{children}</main>
        </div>
    )
}