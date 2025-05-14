import { useUrlParams } from "dhis2-semis-functions"
import { useDataStoreKey } from "dhis2-semis-components";
import { useLocation, useNavigate } from "react-router-dom";
import { menuData } from "../../utils/constants/menu/menuData";
import { formatMenuData } from "../../utils/common/menu/formatMenuData";

const useMenuData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { urlParameters } = useUrlParams();
  const { sectionType } = urlParameters()
  const selectedSectionType = sectionType ?? "student"
  const { filters, defaults } = useDataStoreKey({ sectionType: selectedSectionType });

  /**
   * TODO
   * - Get section from the functions lib
   * - Preserve url paramiters for the same sectionType - Done 13.05.2025
   * - Config menu items visibility
   */

  const filterDataElements = sectionType ? filters : undefined
  const academicYear = sectionType ? defaults?.currentAcademicYear : ""

  return {
    menuData: formatMenuData({
      appsList: [], location,
      sectionType: selectedSectionType,
      menuData: menuData({
        filterDataElements, navigate,
        locationParms: location?.search.slice(1),
        currentAcademicYear: academicYear,
      }),
    }),
  };
};

export { useMenuData };
