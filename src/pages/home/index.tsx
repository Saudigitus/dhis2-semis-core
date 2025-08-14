import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { DashboardCard, DataStoreState, WithPadding } from "dhis2-semis-components";
import DashboardLayout from "../../components/dashboard/dashboardLayout";
import { useMenuData } from "../../hooks/menu/useMenuData";
import { validateAndConvertArrayAgainstReference } from "../../utils/constants/valuesFormatter/valuesFormatter";
import { values } from "../../utils/constants/values/values";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import AlertWithActions from "../../components/alert/alertWithActions";
import { NoticeBox } from "@dhis2/ui";
import { Center } from "@dhis2/ui";
import { ValidationSchema } from "../../schemas/validation/validationSchema";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false)
  const [validation, setValidation] = useRecoilState(ValidationSchema)
  const dataStore = useRecoilValue(DataStoreState)
  const { homePageData } = useMenuData()
  const { errors, isValid, converted, academicYear } = validateAndConvertArrayAgainstReference(dataStore, values as unknown as any)

  const makeAction = (path: string, title: string) => ({
    icon: <MenuIcon />,
    label: `List ${path.replace("-", " ")}`,
    onAction: () => title != "Configurations" ? navigate(`/semis/${path}?sectionType=${title.toLocaleLowerCase()}`) : navigate(`/semis/${path}`),
  });

  console.log(errors, isValid, converted,'jshdfjshdjsd')
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
      {open && <AlertWithActions setValidation={setValidation} validation={validation} open={open} setOpen={setOpen} />}

      {
        validation.deniedConversion == true && <div style={{ marginTop: "20px" }} >
          <Center>
            <NoticeBox warning title={`Invalid configurations!`}>
              The configurations found are not compatible with this version of SEMIS, please go to configurations app below and update the configrations!
            </NoticeBox>
          </Center>
        </div>
      }

      <WithPadding p="1rem">
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