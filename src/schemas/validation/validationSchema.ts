import { atom } from "recoil";

export const ValidationSchema = atom<{ valid: boolean | any, converted: any, deniedConversion: boolean }>({
    key: "data-store-data-state",
    default: { valid: null, converted: null, deniedConversion: false }
})