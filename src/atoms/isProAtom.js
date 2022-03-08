import { atom, selector } from "recoil";

export const isProAtom = atom({
    key: "isProAtom",
    default: Boolean(localStorage.getItem("isPro") === "true"),
});
