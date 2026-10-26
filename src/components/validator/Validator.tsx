import { useDataStoreStatus, WithPadding, DataStoreState } from "dhis2-semis-components";
import { UserInfoState } from "dhis2-semis-functions";
import { NoticeBox } from "@dhis2/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import AlertWithActions from "../alert/alertWithActions";
import { useValidate } from "../../utils/constants/valuesFormatter/valuesFormatter";
import { ValidationSchema } from "../../schemas/validation/validationSchema";
import { values } from "../../utils/constants/values/values";
import i18n from "../../locales";

const sectionLabel = (section: string) => section === "staff" ? i18n.t("Staff") : i18n.t("Student")

const settingLabel = (setting: string) => ({
    "program": i18n.t("Program"),
    "registration": i18n.t("Enrollment"),
    "attendance": i18n.t("Attendance"),
    "absenteeism": i18n.t("Absenteeism"),
    "performance": i18n.t("Performance"),
    "final-result": i18n.t("Final result"),
    "transfer": i18n.t("Transfer"),
    "filters": i18n.t("Filters"),
    "defaults": i18n.t("Defaults"),
    "socio-economics": i18n.t("Socio-economics"),
    "profile": i18n.t("Profile"),
} as Record<string, string>)[setting] ?? setting

const Validator = () => {
    const dataStore: any = useRecoilValue(DataStoreState)
    const userInfo: any = useRecoilValue(UserInfoState)
    const [open, setOpen] = useState<boolean>(false)
    const { validateAndConvertArrayAgainstReference } = useValidate()
    const { dataStoreStatus } = useDataStoreStatus()
    const [validation, setValidation] = useRecoilState<any>(ValidationSchema)
    // Only superusers can change the SEMIS settings (the same rule as the Configurations menu).
    const isAdmin = Boolean(userInfo?.authorities?.includes("ALL"))

    useEffect(() => {
        if (dataStore != undefined) {
            const { isValid, converted, academicYear, currentAcademicYear, toReview, canConvert } = validateAndConvertArrayAgainstReference(
                dataStore,
                values as unknown as any
            )

            if (isValid) {
                setValidation((prev: any) => ({ ...prev, valid: true }))
            } else if (isAdmin && canConvert) {
                setValidation({ valid: true, converted: converted, deniedConversion: false, year: academicYear, currentAcademicYear: currentAcademicYear, toReview })
                setOpen(true)
            } else {
                // Nothing the app can convert, or a user who cannot change the settings: tell them what to do.
                setValidation({ valid: false, deniedConversion: true, toReview })
            }
        }
    }, [dataStore, isAdmin])

    const notSetUp = Boolean(dataStoreStatus?.not_found_config || dataStoreStatus?.not_found_calendar || validation.deniedConversion)
    const toReview = (validation.toReview ?? [])
        .map(({ section, setting }: { section: string, setting: string }) => `${settingLabel(setting)} (${sectionLabel(section)})`)
        .filter((label: string, i: number, all: string[]) => all.indexOf(label) === i)

    return (
        <WithPadding p={notSetUp ? "10px 30px" : "0px"}>
            {
                !isAdmin && notSetUp &&
                <NoticeBox warning title={i18n.t('SEMIS is not fully set up')}>
                    {i18n.t('Contact your SEMIS administrator.')}
                </NoticeBox>
            }
            {
                isAdmin && dataStoreStatus?.not_found_config &&
                <div style={{ marginBottom: "8px" }}>
                    <NoticeBox warning title={i18n.t('No configuration found!')}>
                        {i18n.t('SEMIS needs the SEMIS metadata on this instance. Then set up Student and Staff in Configurations.')}
                    </NoticeBox>
                </div>
            }
            {
                isAdmin && !dataStoreStatus?.not_found_config && dataStoreStatus?.not_found_calendar &&
                <NoticeBox warning title={i18n.t('School calendar configuration not found!')}>
                    {i18n.t('Go to Configurations -> Enrollment application and set value to academic year field.')}
                </NoticeBox>
            }

            {open && <AlertWithActions setValidation={setValidation} validation={validation} open={open} setOpen={setOpen} />}

            {
                isAdmin && validation.deniedConversion == true &&
                <div>
                    <NoticeBox warning title={i18n.t('Invalid configurations!')}>
                        {toReview.length > 0
                            ? i18n.t('Review {{settings}} in Configurations.', { settings: toReview.join(", "), interpolation: { escapeValue: false } })
                            : i18n.t('The configurations found are not compatible with this version of SEMIS. Open SEMIS again to update them.')}
                    </NoticeBox>
                </div>
            }
        </WithPadding>
    )
}

export default Validator
