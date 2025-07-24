import { Alert, AlertTitle, Backdrop, Button } from "@mui/material"
import usePostDataStore from "../../hooks/dataStore/usePostDataStore"
import { Center } from "@dhis2/ui"
import { CircularLoader } from "@dhis2/ui"

export default function AlertWithActions({ setValidation, setOpen, open, validation }: { setValidation: (args: any) => void, validation: any, open: boolean, setOpen: (args: boolean) => void }) {
    const { createDataStore, loading } = usePostDataStore()

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={open}
        >
            {loading ?
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