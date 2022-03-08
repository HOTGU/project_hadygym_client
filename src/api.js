import axios from "axios";
import cookie from "react-cookies";
import { callRefreshToken, logoutHandler } from "./utils/auth";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

// User

export const signupApi = (data) => axios.post("/user/signup", data);

export const signinApi = (data) => axios.post("/user/signin", data);

export const refreshApi = () => axios.post("/user/refresh");

export const getMe = () => axios.get(`/user/me`);

export const getMePosts = () => axios.get(`/user/me/posts`);

export const updateMe = (data) =>
    axios.post(`/user/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const logoutApi = () => axios.post("/user/logout");

// Pro
export const getProApi = () => axios.get("/pro/get");

export const registerProApi = (data) => axios.post("/pro/register", data);

// Address

export const getAddressByTerm = (term) => axios.get(`/address/search?term=${term}`);

// Post

export const createPostApi = (data) => axios.post(`/post/create`, data);

export const updatePostApi = (id, data) => axios.post(`/post/${id}/update`, data);
export const deletePostApi = (id) => axios.get(`/post/${id}/delete`);

export const fetchPostsApi = (loadNumber, loadLimit) =>
    axios.get(`/post/fetch?loadNumber=${loadNumber}&loadLimit=${loadLimit}`);

export const searchApi = (category, location, loadNumber, loadLimit) =>
    axios.get(
        `/post/search?category=${category}&location=${location}&loadNumber=${loadNumber}&loadLimit=${loadLimit}`
    );

export const getPostById = (id) => axios.get(`/post/${id}`);

// Email

export const sendEmailApi = (email) => axios.post(`/email/send`, email);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response } = error;
        if (response?.status === 401) {
            if (
                response.data.message ===
                    ("auth token does not exists" || "auth token does not verify") &&
                Boolean(cookie.load("refreshToken"))
            ) {
                await callRefreshToken();
                return axios(response?.config);
            } else if (
                response.data.message ===
                    ("auth token does not exists" || "auth token does not verify") &&
                !Boolean(cookie.load("refreshToken"))
            ) {
                logoutHandler();
                window.location.reload();
                return;
            } else {
                return (window.location.href = "/auth");
            }
        }
        return Promise.reject(error);
    }
);
