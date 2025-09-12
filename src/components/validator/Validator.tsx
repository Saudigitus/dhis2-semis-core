import { useDataStoreStatus, WithPadding, DataStoreState } from "dhis2-semis-components";
import { NoticeBox, Center } from "@dhis2/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import AlertWithActions from "../alert/alertWithActions";
import { validateAndConvertArrayAgainstReference } from "../../utils/constants/valuesFormatter/valuesFormatter";
import { ValidationSchema } from "../../schemas/validation/validationSchema";
import { values } from "../../utils/constants/values/values";

const Validator = () => {
    const dataStore: any = useRecoilValue(DataStoreState)
    const [open, setOpen] = useState<boolean>(false)
    const { errors, isValid, converted, academicYear } = validateAndConvertArrayAgainstReference(dataStore, values as unknown as any)
    const { dataStoreStatus } = useDataStoreStatus()
    const [validation, setValidation] = useRecoilState<any>(ValidationSchema)

    useEffect(() => {
        if (!isValid) {
            setValidation({ valid: true, converted: converted, deniedConversion: false, year: academicYear })
            setOpen(true)
        } else {
            setValidation((prev: any) => ({ ...prev, valid: true }))
        }
    }, [])

    return (
        <WithPadding p="10px 30px">
            {
                dataStoreStatus?.not_found_config &&
                <div style={{ marginBottom: "8px" }}>
                    <NoticeBox warning title={`No configuration found!`}>
                        Use semis configuration app to setup your semis workspace.
                    </NoticeBox>
                </div>
            }
            {
                !dataStoreStatus?.not_found_config && dataStoreStatus?.not_found_calendar &&
                <NoticeBox warning title={`School calendar configuration not found!`}>
                    Use enrollment configuration app to create a new school calendar configuration.
                </NoticeBox>
            }

            {/* {open && <AlertWithActions setValidation={setValidation} validation={validation} open={open} setOpen={setOpen} />}

            {
                validation.deniedConversion == true &&
                <div>
                    <NoticeBox warning title={`Invalid configurations!`}>
                        The configurations found are not compatible with this version of SEMIS, please go to configurations app below and update the configrations!
                    </NoticeBox>
                </div>
            } */}
        </WithPadding>
    )
}

export default Validator