import { atom } from "recoil";

export const ValidationSchema = atom<{ valid: boolean | null, converted: any, deniedConversion: boolean, year: string | null }>({
    key: "data-store-data-state",
    default: { valid: null, converted: null, deniedConversion: false, year: null }
})