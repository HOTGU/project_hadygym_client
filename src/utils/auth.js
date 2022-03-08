import axios from "axios";
import { refreshApi } from "../api";
import cookie from "react-cookies";

const COOKIE_SET_TIME = 1000 * 60 * 29; // 30분

let refreshTimer;

export const callRefreshToken = async () => {
    try {
        const { status, data } = await refreshApi();
        if (status === 200) {
            axios.defaults.headers.authorization = "Bearer " + data.accessToken;
            clearTimeout(refreshTimer);
            refreshTimer = setTimeout(callRefreshToken, COOKIE_SET_TIME);
        }
    } catch (error) {
        console.log(error);
    }
};

export const loginHandler = (userInfo, accessToken, refreshToken) => {
    cookie.save("user", { ...userInfo }, { path: "/", secure: true });

    axios.defaults.headers.authorization = "Bearer " + accessToken;

    const expires = new Date();
    expires.setDate(Date.now() + 1000 * 60 * 60 * 24); //하루

    cookie.save("refreshToken", refreshToken, {
        path: "/",
        expires,
        secure: true,
        httpOnly: false, // dev/prod 에 따라 true / false 로 받게 했다.
    });
    refreshTimer = setTimeout(callRefreshToken, COOKIE_SET_TIME);
};

export const logoutHandler = () => {
    cookie.remove("user");
    cookie.remove("refreshToken");
    clearTimeout(refreshTimer);
    axios.defaults.headers.authorization = "";
};
