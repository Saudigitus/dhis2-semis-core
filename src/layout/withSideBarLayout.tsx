import { Outlet, useLocation } from "react-router-dom"
import LayoutWrapper from "./layoutWrapper"
import { useMenuData } from "../hooks/menu/useMenuData"
import { SideBar, SideBarLayout } from "dhis2-semis-components"
import { useEffect, useRef } from "react"
import { useSetRecoilState } from "recoil"
import { UrlParamsState } from "../schemas/urlParams/paramSchema"
import { useUrlParams } from "dhis2-semis-functions"

const WithSideBarLayout = () => {
    const { menuData } = useMenuData()
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