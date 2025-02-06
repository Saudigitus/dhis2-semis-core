import { DashboardCard, WithPadding } from "dhis2-semis-components"
import enrollmentImage from "../../assets/images/home/enrollment.png"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboardLayout";

const Home = () => {
  const navigate = useNavigate()
  const currentAcademicYear = "2025"

  return (
    <>
      <DashboardLayout title="Students">
        <DashboardCard icon={enrollmentImage} contents={[{ label: "Enrollment" }]} actions={[
          {
            icon: <MenuIcon />,
            label: "List Enrollment",
            onAction() {
              navigate(`/semis/enrollments?sectionType=student&academicYear=${currentAcademicYear}`)
            }
          }
        ]} />
      </DashboardLayout>
    </>
  )
}

export default Home