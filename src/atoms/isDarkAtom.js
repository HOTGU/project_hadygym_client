import { atom } from "recoil";

console.log(typeof localStorage.getItem("isDark"));

export const isDarkAtom = atom({
    key: "isDarkState",
    default: Boolean(localStorage.getItem("isDark") === "true"),
});
