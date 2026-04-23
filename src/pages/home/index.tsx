import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { DashboardCard, useSchoolCalendarKey, WithPadding } from "dhis2-semis-components";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import { useMenuData } from "../../hooks/menu/useMenuData";
import Validator from "../../components/validator/Validator";
import i18n from "../../locales/index.js";

const Home = () => {
  const navigate = useNavigate();
  const { homePageData } = useMenuData()
  const schoolCalendar = useSchoolCalendarKey()

  const defaultAcademicYear = schoolCalendar?.defaults?.academicYear ?? ""

  const makeAction = (path: string, sectionId: string) => ({
    icon: <MenuIcon />,
    label: i18n.t(`List ${path.replace("-", " ")}`),
    onAction: () => sectionId != "configurations" ? navigate(`/semis/${path}?sectionType=${sectionId}&academicYear=${defaultAcademicYear}`) : navigate(`/semis/${path}`),
  });

  return (
    <Box height={"93vh"}>
      <WithPadding p="1rem">
        <Validator />
        <>
          {
            homePageData?.map(({ title, subItems, id }: any) => {
              return (
                <DashboardLayout title={title} >
                  {
                    subItems.map(({ label, icon, path }: any) => (
                      <DashboardCard
                        key={label}
                        icon={icon}
                        contents={[{ label }]}
                        dataTest={"card-" + label.toLocaleLowerCase() + "-" + title.toLocaleLowerCase() + "-home"}
                        actions={[makeAction(path, id)]}
                      />
                    ))
                  }
                </DashboardLayout>
              )
            })
          }
        </>
      </WithPadding >
    </Box>
  );
};

export default Home;