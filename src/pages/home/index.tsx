import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { DashboardCard, useSchoolCalendarKey, WithPadding } from "dhis2-semis-components";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import { useMenuData } from "../../hooks/menu/useMenuData";
import Validator from "../../components/validator/Validator";

const Home = () => {
  const navigate = useNavigate();
  const { homePageData } = useMenuData()
  const schoolCalendar = useSchoolCalendarKey()

  const defaultAcademicYear = schoolCalendar?.defaults?.academicYear ?? ""

  const makeAction = (path: string, title: string) => ({
    icon: <MenuIcon />,
    label: `List ${path.replace("-", " ")}`,
    onAction: () => title != "Configurations" ? navigate(`/semis/${path}?sectionType=${title.toLocaleLowerCase()}&academicYear=${defaultAcademicYear}`) : navigate(`/semis/${path}`),
  });


  useEffect(() => {
    if (!isValid) {
      setValidation({ valid: false, converted: converted, deniedConversion: false, year: academicYear })
      setOpen(true)
    } else {
      setValidation((prev) => ({ ...prev, valid: true }))
    }
  }, [])

  return (
    <Box height={"93vh"}>
      <WithPadding p="1rem">
        <Validator />
        <>
          {
            homePageData?.map(({ title, subItems }: any) => {
              return (
                <DashboardLayout title={title} >
                  {
                    subItems.map(({ label, icon, path }: any) => (
                      <DashboardCard
                        key={label}
                        icon={icon}
                        contents={[{ label }]}
                        actions={[makeAction(path, title)]}
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