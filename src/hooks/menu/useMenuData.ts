import { useLocation } from "react-router-dom";
import { useDataStoreKey } from "dhis2-semis-components";
import { menuData } from "../../utils/constants/menuData";
import { formatMenuData } from "../../utils/common/menu/formatMenuData";

const useMenuData = () => {
    const location = useLocation()
    const { dataStoreValues } = useDataStoreKey()
    const currentAcademicYear = dataStoreValues[0]?.defaults?.currentAcademicYear

    /** 
     * TODO 
     * - Get section from the functions lib
     * - Preserve url paramiters for the same sectionType
     * - Config menu items visibility
    */
    
    return {
        menuData: formatMenuData(menuData(currentAcademicYear as string), [], location, "student")
    }
}

export { useMenuData }