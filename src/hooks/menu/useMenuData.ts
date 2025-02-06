import { useLocation, useNavigate } from "react-router-dom";
import { useDataStoreKey } from "dhis2-semis-components";
import { menuData } from "../../utils/constants/menuData";
import { formatMenuData } from "../../utils/common/menu/formatMenuData";

const useMenuData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { dataStoreValues } = useDataStoreKey({});
  const currentAcademicYear: string = "2024";

  /**
   * TODO
   * - Get section from the functions lib
   * - Preserve url paramiters for the same sectionType
   * - Config menu items visibility
   */

  return {
    menuData: formatMenuData(
      menuData(currentAcademicYear as string, navigate),
      [],
      location,
      "student"
    ),
  };
};

export { useMenuData };
