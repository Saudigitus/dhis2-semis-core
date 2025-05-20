import { Location } from "react-router-dom";
import { SideBarItemProps, SideBarSubItemProps } from "dhis2-semis-components/dist/declarations/types/sideBar/SideBarTypes";

type formatMenuDataParams = {
    menuData: SideBarItemProps[], appsList: any[], location: Location, sectionType: string
}

export function formatMenuData({ menuData, location, sectionType }: formatMenuDataParams): SideBarItemProps[] {
    const activeMenu = findMenuWithActivePath({ menuData, location, sectionType });
    const visibleMenu = checkMenuItemsVisibility({ menuData: activeMenu });

    return visibleMenu;
}

type findMenuWithActivePathParams = {
    menuData: SideBarItemProps[], location: Location, sectionType: string
}

function findMenuWithActivePath({ menuData, location, sectionType }: findMenuWithActivePathParams): SideBarItemProps[] {
    menuData
        ?.map((menuItem: SideBarItemProps) => menuItem.subItems
            ?.map((menuSubItem: SideBarSubItemProps) =>
                menuSubItem.active = Boolean(
                    menuSubItem.route === location.pathname && (
                        menuItem.title !== "Navigation" ?
                            menuItem.title.toLocaleLowerCase() === sectionType?.toLocaleLowerCase()
                            : true
                    )
                )
            )
        )

    return menuData
}

function checkMenuItemsVisibility({ menuData }: { menuData: SideBarItemProps[] }): SideBarItemProps[] {
    menuData?.filter((menuItem: SideBarItemProps) => menuItem.displayInMenu)?.map((menuItem: SideBarItemProps) => {
        menuItem?.subItems?.map((menuSubItem: SideBarSubItemProps) => {
            // menuSubItem.displayInMenu = Boolean(appsList?.find((app) => app.key === menuSubItem.appName))
            menuSubItem.displayInMenu = true
        })
    })

    menuData?.filter((menuItem: SideBarItemProps) => menuItem.displayInMenu)?.map((menuItem: SideBarItemProps) => {
        menuItem.displayInMenu = !Boolean(menuItem?.subItems?.every((menuSubItem: SideBarSubItemProps) => !menuSubItem.displayInMenu))
    })

    return menuData
}