import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { Camera } from "@styled-icons/fa-solid";
import toast from "react-hot-toast";
import cookie from "react-cookies";

import Button from "../Button";
import { isAuthAtom } from "../../atoms/isAuthAtom";
import Avatar from "../Avatar";
import { updateMe } from "../../api";
import { postsState } from "../../atoms/postsAtom";

const SForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const AvatarWrapper = styled.div`
    position: relative;
`;
const CameraEmoji = styled(Camera)`
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 99;
    color: ${(props) => props.theme.colors.white};
    background-color: ${(props) => props.theme.accentColor};
    padding: 3px;
    border-radius: 50%;
    width: 24px;
    border: 1px solid ${(props) => props.theme.textColor};
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-family: "GMarket";
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    margin-top: 15px;
    border-radius: 5px;
`;

const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 10px;
`;

function UpdateMeForm({ show, setShow }) {
    const [{ userInfo }, setIsAuth] = useRecoilState(isAuthAtom);
    const [posts, setPosts] = useRecoilState(postsState);

    const imgRef = useRef();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm();

    register("avatar");

    const file = watch("avatar");

    useEffect(() => {
        setValue("nickname", userInfo?.nickname);
        setValue("avatar", "");
    }, [userInfo, show, setValue]);

    const onValid = async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar);
        formData.append("nickname", data.nickname);
        const promise = updateMe(formData).then((response) => {
            cookie.save("user", {
                nickname: response.data.user.nickname,
                avatar: response.data.user.avatar,
            });
            setIsAuth({
                loggedIn: true,
                userInfo: {
                    nickname: response.data.user.nickname,
                    avatar: response.data.user.avatar,
                },
            });
            const updated = posts.map((post) => {
                if (post.creator._id !== response.data.user.id) {
                    return post;
                }
                if (post.creator._id === response.data.user.id) {
                    return {
                        ...post,
                        creator: {
                            ...post.creator,
                            nickname: response.data.user.nickname,
                            avatar: response.data.user.avatar,
                        },
                    };
                }
            });
            setPosts(updated);
            setShow(!show);
        });
        toast.promise(promise, {
            loading: "업데이트 중",
            success: "업데이트 완료",
            error: "업데이트 실패",
        });
    };

    return (
        <>
            <SForm onSubmit={handleSubmit(onValid)}>
                <AvatarWrapper>
                    {file ? (
                        <Avatar
                            src={URL.createObjectURL(file)}
                            onClick={() => imgRef.current.click()}
                            click={true}
                        />
                    ) : (
                        <Avatar
                            onClick={() => imgRef.current.click()}
                            click={true}
                            src={userInfo?.avatar}
                        />
                    )}
                    <CameraEmoji />
                </AvatarWrapper>
                <SInput
                    type="file"
                    name="avatar"
                    onChange={(e) => setValue("avatar", e.target?.files[0])}
                    ref={imgRef}
                    hidden={true}
                />
                <SInput
                    {...register("nickname", {
                        required: "닉네임은 필수항목입니다",
                        minLength: {
                            value: 2,
                            message: "최소 2자이상이여야 합니다.",
                        },
                        maxLength: { value: 12, message: "최대 12자입니다." },
                    })}
                    placeholder="닉네임"
                    errors={errors.nickname}
                />
                {errors.nickname && errors.nickname.message && (
                    <ErrorText>{errors.nickname.message}</ErrorText>
                )}
                <Button>수정완료</Button>
            </SForm>
        </>
    );
}

export default UpdateMeForm;
