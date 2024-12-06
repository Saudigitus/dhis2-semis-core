import { Location } from "react-router-dom";
import { SideBarItemProps, SideBarSubItemProps } from "dhis2-semis-components/dist/declarations/types/sideBar/SideBarTypes";

export function formatMenuData(menuData: SideBarItemProps[], appsList: any[], location: Location, sectionType: string): SideBarItemProps[] {
    const activeMenu = findMenuWithActivePath(menuData, location, sectionType);
    const visibleMenu = checkMenuItemsVisibility(activeMenu);

    return visibleMenu;
}

function findMenuWithActivePath(menuData: SideBarItemProps[], location: Location, sectionType: string): SideBarItemProps[] {
    menuData
        ?.map((menuItem: SideBarItemProps) => menuItem.subItems
            ?.map((menuSubItem: SideBarSubItemProps) =>
                menuSubItem.active = Boolean(
                    menuSubItem.route === location.pathname &&
                    (
                        menuItem.title !== "Navigation" ?
                            menuItem.title.toLocaleLowerCase() === sectionType.toLocaleLowerCase()
                            : true
                    )
                )
            )
        )

    return menuData
}

function checkMenuItemsVisibility(menuData: SideBarItemProps[]): SideBarItemProps[] {
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