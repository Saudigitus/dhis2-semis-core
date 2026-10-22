import { Alert, AlertTitle, Backdrop, Button } from "@mui/material"
import usePostDataStore from "../../hooks/dataStore/usePostDataStore"
import { Center } from "@dhis2/ui"
import { CircularLoader } from "@dhis2/ui"
import { DataStoreState, SchoolCalendarData, useGetDataStore } from "dhis2-semis-components"
import { DataStoreValidationSchemaType } from "../../schemas/validation/validationSchema"
import { useSetRecoilState } from "recoil"

interface AlertWithActionsProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    validation: DataStoreValidationSchemaType;
    setValidation: (validation: DataStoreValidationSchemaType) => void;
}

export default function AlertWithActions({ setValidation, setOpen, open, validation }: AlertWithActionsProps) {
    const { error: errorInGet, getDataStore } = useGetDataStore()
    const { createDataStore, loading } = usePostDataStore({ keySpace: "dataStore/semis/values" })
    const { createDataStore: createSchoolCalendar, loading: loadingCalendar } = usePostDataStore({ keySpace: "dataStore/semis/schoolCalendar" })
    const setDataStore = useSetRecoilState(DataStoreState)
    const setSchoolCalendar = useSetRecoilState(SchoolCalendarData)

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
        >
            {(loading || loadingCalendar) ?
                <Center>
                    <CircularLoader />
                </Center>
                :
                <Alert
                    severity="warning"
                >
                    <AlertTitle>Warning!</AlertTitle>
                    <span style={{ marginRight: "40px" }} >The configurations found are not compatible with this version of SEMIS, would you like to convert?</span>
                    <Button
                        onClick={async () => {
                            await createDataStore({ data: validation.converted })
                            if (validation?.year) {
                                // Add the academic year to the calendar that exists: its periods and holidays are kept.
                                const currentCalendar = await getDataStore("dataStore/semis/schoolCalendar").catch(() => undefined)
                                await createSchoolCalendar({
                                    data: {
                                        ...currentCalendar,
                                        academicYear: validation?.year,
                                        defaults: { ...currentCalendar?.defaults, ...(validation.currentAcademicYear ? { academicYear: validation.currentAcademicYear } : {}) },
                                        schoolCalendar: currentCalendar?.schoolCalendar ?? []
                                    }
                                })
                                const updatedSchoolCalendar = await getDataStore("dataStore/semis/schoolCalendar")
                                setSchoolCalendar(updatedSchoolCalendar)
                            }

                            const updateDataStore = await getDataStore("dataStore/semis/values")
                            
                            setDataStore(updateDataStore)
                            setOpen(false)
                            
                            setValidation({ valid: true, deniedConversion: false })
                        }}
                        color="error"
                        size="small"
                    >
                        Yes
                    </Button>
                    <Button onClick={() => {
                        setValidation({ valid: false, deniedConversion: true })
                        setOpen(false)
                    }} color="primary" size="small">
                        No
                    </Button>
                </Alert>}
        </Backdrop>
    )
}