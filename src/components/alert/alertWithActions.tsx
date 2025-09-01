import { Alert, AlertTitle, Backdrop, Button } from "@mui/material"
import usePostDataStore from "../../hooks/dataStore/usePostDataStore"
import { Center } from "@dhis2/ui"
import { CircularLoader } from "@dhis2/ui"
import { useGetDataStore } from "dhis2-semis-components"
import { DataStoreValidationSchemaType } from "../../schemas/validation/validationSchema"

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
                            if (validation?.year)
                                await createSchoolCalendar({
                                    data: { academinYear: validation?.year, defaults: { academicYear: "" }, schoolCalendar: [] }
                                })

                            await getDataStore(false)
                            setValidation({ valid: true, deniedConversion: false })
                            setOpen(false)
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