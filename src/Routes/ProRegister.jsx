import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Camera } from "@styled-icons/fa-solid";
import { useForm } from "react-hook-form";

import Avatar from "../Componenets/Avatar";
import RouteGuard from "../Componenets/RouteGuard";
import { useHistory } from "react-router-dom";

const SForm = styled.form`
    width: 100%;
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    /* width: 100%; */
    font-family: "GMarket";
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    margin-top: 15px;
    border-radius: 5px;
`;

const Profile = styled.div`
    display: flex;
    align-items: center;
    & input {
        width: 150px;
    }
`;
const AvatarWrapper = styled.div`
    position: relative;
    margin-right: 15px;
`;

const CameraEmoji = styled(Camera)`
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.accentColor};
    padding: 3px;
    border-radius: 50%;
    width: 24px;
    border: 1px solid ${(props) => props.theme.textColor};
`;

function ProRegister() {
    const imgRef = useRef();
    const history = useHistory();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm();

    const file = watch("avatar");

    const handleUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Some browsers display this to the use";
    };

    useEffect(() => {
        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    const onValid = (data) => {
        console.log(data);
    };

    return (
        <>
            <SForm onSubmit={handleSubmit(onValid)}>
                <RouteGuard
                    shouldGuard={true}
                    title="변경사항이 저장되지 않습니다. 그래도 나가시겠습니까?"
                />
                <div
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    뒤로
                </div>
                <div>자기소개</div>
                <div>프로그램</div>
                <div>자신의 얼굴이 나오는 프로필 사진과 본명을 적으세요</div>
                <Profile>
                    <AvatarWrapper>
                        {file ? (
                            <Avatar
                                src={URL.createObjectURL(file)}
                                onClick={() => imgRef.current.click()}
                                click={true}
                            />
                        ) : (
                            <Avatar onClick={() => imgRef.current.click()} click={true} />
                        )}
                        <CameraEmoji />
                    </AvatarWrapper>
                    <input
                        type="file"
                        name="avatar"
                        onChange={(e) => setValue("avatar", e.target?.files[0])}
                        ref={imgRef}
                        hidden={true}
                    />
                    <SInput {...register("name")} placeholder="본명" />
                </Profile>

                <SInput {...register("gender")} placeholder="gender" />
            </SForm>
        </>
    );
}

export default ProRegister;
