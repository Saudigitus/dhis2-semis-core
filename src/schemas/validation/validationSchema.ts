import { atom } from "recoil";

export type DataStoreValidationSchemaType = {
    valid: boolean | null;
    converted?: any;
    deniedConversion: boolean;
    year?: string | null;
    currentAcademicYear?: string | null;
};

export const ValidationSchema = atom<DataStoreValidationSchemaType>({
    key: "data-store-data-state",
    default: { valid: null, converted: null, deniedConversion: false, year: null }
})