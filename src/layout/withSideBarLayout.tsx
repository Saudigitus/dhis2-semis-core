import { Outlet, useLocation } from "react-router-dom"
import LayoutWrapper from "./layoutWrapper"
import { useMenuData } from "../hooks/menu/useMenuData"
import { SideBar, SideBarLayout } from "dhis2-semis-components"
import { useEffect, useRef } from "react"
import { useSetRecoilState } from "recoil"
import { UrlParamsState } from "../schemas/urlParams/paramSchema"
import { useUrlParams } from "dhis2-semis-functions"
import { useConfig } from "@dhis2/app-runtime"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()
    // The version of the installed app (package.json), shown at the bottom of the menu to help support.
    const { appVersion } = useConfig()
    const { useQuery } = useUrlParams()
    const sectionType = useQuery.get("sectionType")
    const location = useLocation()
    const isFirstRender = useRef(true);
    const prevSearchRef = useRef(location.search);
    const prevPathRef = useRef(location.pathname);
    const prevSectionTypeRef = useRef(sectionType)
    const setURLParam = useSetRecoilState(UrlParamsState)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if ((location.search != prevSearchRef.current)
            && (location.pathname == prevPathRef.current)
            && (prevSectionTypeRef.current == sectionType)) {
            setURLParam(location.search)
            prevSearchRef.current = location.search;
        } else if (prevSectionTypeRef.current != sectionType) {
            setURLParam(null)
        }
        prevSectionTypeRef.current = sectionType
        prevPathRef.current = location.pathname;
    }, [location.search, location.pathname, sectionType]);

    return (
        <SideBarLayout
            sidebar={
                <SideBar
                    collapsed={false}
                    sideBarData={menuData}
                    stickLastItemToBottom={false}
                    sideBarBtnPosition="top-offset"
                    footer={appVersion?.full ? `SEMIS ${appVersion.full}` : undefined}
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