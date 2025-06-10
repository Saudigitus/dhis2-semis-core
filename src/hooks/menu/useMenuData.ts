import { useDataStoreKey } from "dhis2-semis-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetSectionTypeLabel } from "dhis2-semis-functions"
import { menuData } from "../../utils/constants/menu/menuData";
import { formatMenuData } from "../../utils/common/menu/formatMenuData";

/** TODO - Config menu items visibility*/
const useMenuData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionName } = useGetSectionTypeLabel()
  const { filters } = useDataStoreKey({ sectionType: sectionName ?? "" }) ?? [];


  return {
    menuData: formatMenuData({
      appsList: [], location,
      sectionType: sectionName,
      menuData: menuData({
        pathname: location.pathname,
        filterDataElements: filters, navigate,
        locationParams: location?.search.slice(1),
      }),
    }),
  };
};

export { useMenuData };
