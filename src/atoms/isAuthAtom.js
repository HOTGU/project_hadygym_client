import { atom } from "recoil";
import cookie from "react-cookies";

export const isAuthAtom = atom({
    key: "auth",
    default: {
        loggedIn: Boolean(cookie.load("user")),
        userInfo: {
            ...cookie.load("user"),
        },
    },
});
