import { DashboardCard, useDataStoreKey, useProgramsKeys } from "dhis2-semis-components"
import enrollmentImage from "../../assets/images/home/enrollment.png"
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <DashboardCard icon={enrollmentImage} contents={[{ label: "Enrollment" }]} actions={[{
        icon: <MenuIcon />,
        label: "List Enrollment",
        onAction() {
          navigate('enrollments')
        },
      }]} />
    </div>
  )
}

export default Home