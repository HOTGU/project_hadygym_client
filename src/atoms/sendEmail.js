import { atom } from "recoil";

export const verifyEmailAtom = atom({
    key: "verifyEmailAtom",
    default: {
        success: false,
        loading: false,
        email: null,
        number: null,
    },
});

export const verifyNumberAtom = atom({
    key: "verifyNumberAtom",
    default: null,
});

export const isVerfiedEmail = atom({
    key: "isVerifiedAtom",
    default: false,
});
