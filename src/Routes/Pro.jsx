import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getProApi } from "../api";

function Pro() {
    const getPro = async () => {
        await getProApi();
    };
    useEffect(() => {
        console.log("1");
        getPro();
    }, []);
    return (
        <>
            <Link to="/pro/register">프로필 등록</Link>
        </>
    );
}

export default Pro;
