import axios from "axios";
import jwt_decode from "jwt-decode";
import { getCookie, setCookie } from "./utils/cookie";

axios.defaults.baseURL = "http://localhost:5000/";

const axiosJWT = axios.create();

axiosJWT.defaults.withCredentials = true;

axiosJWT.interceptors.request.use(
    async (config) => {
        let currentDate = new Date();
        const decodedToken = jwt_decode(getCookie("access_token"));

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            const res = await refreshApi({ refreshToken: getCookie("refresh_token") });
            const refreshExpires = new Date();
            refreshExpires.setDate(Date.now() + 1000 * 60 * 60 * 24); //하루
            setCookie("access_token", res.data.accessToken, {
                path: "/",
            });
            setCookie("refresh_token", res.data.refreshToken, {
                path: "/",
                refreshExpires,
                secure: true,
                httpOnly: false,
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User

export const signupApi = (data) => axios.post("/user/signup", data);

export const signinApi = (data) => axios.post("/user/signin", data);

export const refreshApi = (refreshToken) => axios.post("/user/refresh", refreshToken);

export const getMe = () => axiosJWT.get(`/user/me`);

export const getUserApi = (id) => axiosJWT.get(`/user/${id}`);

export const getMePosts = () => axiosJWT.get(`/user/me/posts`);

export const updateMe = (data) =>
    axiosJWT.post(`/user/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const logoutApi = () => axiosJWT.post("/user/logout");

// Pro

export const getProApi = (id) => axiosJWT.get(`/pro/get/${id}`);

export const getMeProApi = () => axiosJWT.get("/pro/me");

export const updateProApi = (data) =>
    axiosJWT.post(`/pro/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const registerProApi = (data) =>
    axiosJWT.post("/pro/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Address

export const getAddressByTerm = (term) => axiosJWT.get(`/address/search?term=${term}`);

// Post

export const createPostApi = (data) => axiosJWT.post(`/post/create`, data);

export const updatePostApi = (id, data) => axiosJWT.post(`/post/${id}/update`, data);
export const deletePostApi = (id) => axiosJWT.get(`/post/${id}/delete`);

export const fetchPostsApi = (loadNumber, loadLimit) =>
    axiosJWT.get(`/post/fetch?loadNumber=${loadNumber}&loadLimit=${loadLimit}`);

export const searchApi = (category, location, loadNumber, loadLimit) =>
    axiosJWT.get(
        `/post/search?category=${category}&location=${location}&loadNumber=${loadNumber}&loadLimit=${loadLimit}`
    );

export const getPostById = (id) => axiosJWT.get(`/post/${id}`);

// Email

export const sendEmailApi = (email) => axios.post(`/email/send`, email);

// Conversation

export const createConversationApi = (data) =>
    axiosJWT.post("/conversation/create", data);

export const getConversationApi = () => axiosJWT.get("/conversation/get");
export const getProConversationApi = () => axiosJWT.get("/conversation/get/is-pro");

// Message

export const addMessageApi = (data) => axiosJWT.post("/message/add", data);

export const getMessageApi = (conversationId) =>
    axiosJWT.get(`/message/${conversationId}`);
