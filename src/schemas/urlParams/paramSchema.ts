// state/urlParams.ts
import { atom } from "recoil";

export const UrlParamsState = atom<string|null>({
  key: "UrlParamsState",
  default: null
});
