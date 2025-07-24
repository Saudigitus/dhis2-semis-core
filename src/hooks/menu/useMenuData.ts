import { DataStoreState, useDataStoreKey } from "dhis2-semis-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetSectionTypeLabel } from "dhis2-semis-functions"
import { menuData } from "../../utils/constants/menu/menuData";
import { formatMenuData } from "../../utils/common/menu/formatMenuData";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { dashboardData } from "../../utils/constants/dashboard/dashboardData";
import { ValidationSchema } from "../../schemas/validation/validationSchema";

const useMenuData = () => {
  const validation = useRecoilValue(ValidationSchema)
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionName } = useGetSectionTypeLabel()
  const { filters } = useDataStoreKey({ sectionType: sectionName ?? "" }) ?? [];
  const dataStoreData = useRecoilValue(DataStoreState)
  const [updatedMenuData, updateMenuData] = useState<any>([])
  const [homePageData, updatedHomePageData] = useState<any>([])
  let menuDataArray = menuData({
    pathname: location.pathname,
    filterDataElements: filters,
    navigate,
    locationParams: location?.search.slice(1),
  })

  const updateData = (dadosBrutos: any[]) => {
    let copy = [...dadosBrutos];

    for (const element of dataStoreData) {
      const index = copy.findIndex(x => x.title?.toLowerCase() === element.key);
      if (index === -1) continue;

      const originalSubItems = copy[index].subItems ?? [];
      const filteredSubItems = originalSubItems.filter((subItem: any) => {
        const key = subItem.id;
        return (element as any)[key]?.enabled === true;
      });

      copy[index].subItems = filteredSubItems;
    }

    copy = copy.filter(item => {
      const title = item.title?.toLowerCase()
      if (title === "student" || title === "staff") {
        return dataStoreData.some(data => data.key === title)
      }
      return true
    })

    return copy.filter(item => item.subItems?.length > 0);
  };

  useEffect(() => {
    if (dataStoreData?.length > 0 && validation.valid != false) {
      const sideBarData = updateData(menuDataArray)
      const initialPageData = updateData(structuredClone(dashboardData))
      updatedHomePageData(initialPageData)
      updateMenuData(formatMenuData({
        appsList: [], location,
        sectionType: sectionName,
        menuData: sideBarData
      }))
    } else {
      updatedHomePageData([dashboardData[dashboardData?.length - 1]])
      updateMenuData(menuDataArray?.filter(x => x.title != 'Staff' && x.title != 'Student'))
    }
  }, [dataStoreData, validation.valid])

  return {
    menuData: formatMenuData({
      appsList: [], location,
      sectionType: sectionName,
      menuData: updatedMenuData
    }),
    homePageData
  };
};

export { useMenuData };
