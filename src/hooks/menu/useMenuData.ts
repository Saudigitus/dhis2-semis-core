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
  const { filters, defaults } = useDataStoreKey({ sectionType: sectionName ?? "" }) ?? [];


  return {
    menuData: formatMenuData({
      appsList: [], location,
      sectionType: sectionName,
      menuData: menuData({
        filterDataElements: filters, navigate,
        locationParms: location?.search.slice(1),
        currentAcademicYear: defaults?.currentAcademicYear,
      }),
    }),
  };
};

export { useMenuData };
