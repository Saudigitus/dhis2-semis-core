import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import DashboardLayout from "../../components/dashboardLayout";
import { DashboardCard, WithPadding } from "dhis2-semis-components";
import { dashboardData } from "../../utils/constants/dashboard/dashboardData";
import { Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const currentAcademicYear = "2025";

  const makeAction = (path: string) => ({
    icon: <MenuIcon />,
    label: `List ${path.replace("-", " ")}`,
    onAction: () =>
      navigate(
        `/semis/${path}?sectionType=student&academicYear=${currentAcademicYear}`
      ),
  });


  return (
    <Box height={"93vh"}>
      <WithPadding p="2rem">
        <>
          {
            dashboardData?.map(({ title, cards }) => {
              return (
                <DashboardLayout title={title} >
                  {
                    cards.map(({ label, icon, path }) => (
                      <DashboardCard
                        key={label}
                        icon={icon}
                        contents={[{ label }]}
                        actions={[makeAction(path)]}
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