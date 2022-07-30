import { atom } from "recoil";

export const isLoggedInState = atom<boolean>({
    key: "isLoggedIn",
    default: false,
});
