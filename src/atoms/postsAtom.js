import { atom, selector, selectorFamily } from "recoil";
import { getPostById } from "../api";

export const postsState = atom({
    key: "postsState",
    default: [],
});

export const fetchPostsLoadLimit = atom({
    key: "fetchPostsLoadLimit",
    default: 12,
});

export const fetchPostsLoadNumber = atom({
    key: "fetchPostsLoadNumber",
    default: 1,
});

export const fetchPostsIsLoading = atom({
    key: "fetchPostsIsLoading",
    default: false,
});

export const fetchPostsIsFetch = atom({
    key: "fetchPostsIsFetch",
    default: true,
});

export const postDetailAtom = atom({
    key: "detailPost",
    default: null,
});

export const postIdAtom = atom({
    key: "postId",
    default: "",
});

export const getPostQuery = selectorFamily({
    key: "getPostQuery",
    get: (postId) => async () => {
        const response = await getPostById(postId);
        return response.data;
    },
});

export const resetPostsSelector = selector({
    key: "resetPosts",
    get: ({ get }) => {},
    set: ({ set }) => {
        set(postsState, []);
        set(fetchPostsLoadNumber, 1);
        set(fetchPostsIsFetch, true);
    },
});
