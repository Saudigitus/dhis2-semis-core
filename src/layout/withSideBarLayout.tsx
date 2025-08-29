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
    const location = useLocation();
    const { useQuery } = useUrlParams();
    const sectionType = useQuery.get("sectionType")
    const setUrlParams = useSetRecoilState(UrlParamsState);
    const prevSearchRef = useRef(location.pathname);

    useEffect(() => {
        if (prevSearchRef.current === location.pathname) {
            console.log(prevSearchRef.current , location.pathname)
            setUrlParams(location.search);
        }
        prevSearchRef.current = location.pathname;
    }, [location.search]);

    useEffect(() => {
        console.log("first dsds")
        setUrlParams(null);
    }, [sectionType])

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