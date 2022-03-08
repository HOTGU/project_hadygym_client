import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthAtom } from "../atoms/isAuthAtom";

import PostFormWrapper from "../Routes/PostFormWrapper";

function PostUpdate() {
    const { userInfo } = useRecoilValue(isAuthAtom);
    const { state } = useLocation();
    let history = useHistory();

    useEffect(() => {
        if (!state || userInfo.id !== state?.post?.creator._id) {
            history.push("/");
        }
    });

    return <PostFormWrapper post={state?.post} isUpdate={true} title="글 수정하기" />;
}

export default PostUpdate;
