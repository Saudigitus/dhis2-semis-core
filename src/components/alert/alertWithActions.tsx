import { Alert, AlertTitle, Backdrop, Button } from "@mui/material"
import usePostDataStore from "../../hooks/dataStore/usePostDataStore"
import { updateObject } from "../../utils/constants/valuesFormatter/valuesFormatter"
import { DataStoreState } from "dhis2-semis-components"
import { useRecoilValue } from "recoil"
import { values } from "../../utils/constants/values/values"
import { Center } from "@dhis2/ui"
import { CircularLoader } from "@dhis2/ui"

export default function AlertWithActions({ setOpen, open }: { open: boolean, setOpen: (args: boolean) => void }) {
    const { createDataStore, loading } = usePostDataStore()
    const dataStore = useRecoilValue(DataStoreState)
    const { convert } = updateObject(values, dataStore)

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
                            const converted = convert()
                            await createDataStore(converted)
                        }}
                        color="error"
                        size="small"
                    >
                        Yes
                    </Button>
                    <Button onClick={() => setOpen(false)} color="primary" size="small">
                        No
                    </Button>
                </Alert>}
        </Backdrop>
    )
}