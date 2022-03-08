import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import Button from "../Componenets/Button";
import { sendEmailApi, signinApi, signupApi } from "../api";
import { isAuthAtom } from "../atoms/isAuthAtom";
import { loginHandler } from "../utils/auth";
import { useLocation } from "react-router";
import SvgWelcome from "../Componenets/Images/Welcome";
import Loader from "../Componenets/Loader";

const AuthContainer = styled.div`
    max-width: 320px;
    margin: 0 auto;
`;
const ImgWrapper = styled.div`
    width: 200px;
    margin: 40px auto;
`;
const VerifyWrapper = styled.div`
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
`;
const VerifyInput = styled.input`
    width: 70%;
    margin-left: 5px;
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 5px;
    padding: 10px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.bgColor};
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "auto")};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
`;
const VerifyBtn = styled.div`
    width: 30%;
    padding: 10px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.bgColor};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "cursor")};
    align-items: center;
`;
const EmailWrapper = styled.div`
    position: relative;
`;
const ChangeBtn = styled.span`
    position: absolute;
    right: 10px;
    text-decoration: underline;
    cursor: pointer;
    bottom: 50%;
    margin: auto 0;
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-family: "GMarket";
    font-size: 16px;
    background-color: ${(props) =>
        props.isVerify ? props.theme.hoverColor : props.theme.bgColor};
    color: ${(props) => (props.isVerify ? props.theme.svgColor : props.theme.textColor)};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    border-radius: 5px;
    cursor: ${(props) => (props.isVerify ? "not-allowed" : "auto")};
`;
const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 10px;
`;
const SText = styled.span`
    display: block;
    text-align: right;
    margin-top: 10px;
    & span {
        cursor: pointer;
        margin-left: 10px;
        font-size: 16px;
        color: ${(props) => props.theme.accentColor};
    }
`;

function Auth() {
    const location = useLocation();
    const [isAuth, setIsAuth] = useRecoilState(isAuthAtom);
    const [isSignup, setIsSignup] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verify, setVerify] = useState({
        email: "",
        number: "",
        ok: false,
    });
    const [inputNumber, setInputNumber] = useState();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        setError,
    } = useForm();

    const from = location.state && location.state.from;

    if (isAuth.loggedIn) {
        return <Redirect to={from || "/"} />;
    }

    const handleVerifyEmail = async () => {
        const email = watch("email");
        if (verify.ok) {
            toast("이미 인증했습니다", { icon: "🎈" });
            return;
        }
        try {
            setLoading(true);
            setDisabled(true);
            const res = await sendEmailApi({ email });
            if (res.status === 200) {
                setVerify({
                    ok: false,
                    number: res.data,
                    email,
                });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
        setLoading(false);
        setDisabled(false);
    };

    const handleInput = (e) => {
        if (e.target.value.length > 6 || verify.ok) {
            return e.preventDefault();
        }
        if (parseInt(e.target.value) === verify.number) {
            toast.success("이메일 인증 성공");
            setVerify({ ...verify, ok: true });
        }
        setInputNumber(e.target.value);
    };

    const onValid = async (data) => {
        try {
            setDisabled(true);
            if (isSignup) {
                if (!verify.ok) {
                    toast.error("이메일 인증을 해주세요");
                    setDisabled(false);
                    return;
                }
                const singupPromise = signupApi(data);
                toast.promise(singupPromise, {
                    loading: "회원가입 중...",
                    success: "회원가입 성공",
                    error: "회원가입 실패",
                });
                const response = await singupPromise;
                if (response.status === 200) {
                    setIsSignup(false);
                }
            }
            if (!isSignup) {
                const signinPromise = signinApi(data);
                toast.promise(signinPromise, {
                    loading: "로그인 중...",
                    success: "로그인 성공",
                    error: "로그인 실패",
                });
                const response = await signinPromise;
                if (response?.status === 200) {
                    const {
                        data: { userInfo, accessToken, refreshToken },
                    } = response;
                    loginHandler(userInfo, accessToken, refreshToken);
                    setIsAuth({
                        loggedIn: true,
                        userInfo: { ...userInfo },
                    });
                }
            }
            setDisabled(false);
        } catch (error) {
            const errorLocation = error.response.data.errorLocation;
            const errorMessage = error.response.data.message;
            setDisabled(false);
            setError(errorLocation, { message: errorMessage });
        }
    };

    return (
        <form onSubmit={handleSubmit(onValid)}>
            <AuthContainer>
                <ImgWrapper>
                    <SvgWelcome width="100%" height="auto" />
                </ImgWrapper>
                <EmailWrapper>
                    <SInput
                        {...register("email", {
                            required: "이메일은 필수항목입니다.",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "이메일형식이 아닙니다.",
                            },
                            onChange: () => {
                                if (verify.email) {
                                    setValue("email", verify.email);
                                }
                            },
                        })}
                        placeholder="이메일"
                        errors={errors.email}
                        isVerify={verify.email}
                    />
                    {isSignup && verify.email && (
                        <ChangeBtn
                            onClick={() => {
                                setVerify({ ok: false, email: "", number: "" });
                                setInputNumber();
                            }}
                        >
                            변경
                        </ChangeBtn>
                    )}
                </EmailWrapper>
                {isSignup && (
                    <VerifyWrapper>
                        <VerifyBtn
                            onClick={disabled ? () => {} : handleVerifyEmail}
                            isVerify={verify.ok}
                        >
                            {loading ? (
                                <Loader isCenter={false} height="14px" width="14px" />
                            ) : verify.number ? (
                                verify.ok ? (
                                    "인증완료"
                                ) : (
                                    "다시 보내기"
                                )
                            ) : verify.ok ? (
                                "인증완료"
                            ) : (
                                "이메일 인증"
                            )}
                        </VerifyBtn>
                        {verify.number && (
                            <VerifyInput
                                value={inputNumber}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                                onChange={handleInput}
                                placeholder="인증번호 ex)123456"
                                isVerify={verify.ok}
                            />
                        )}
                    </VerifyWrapper>
                )}
                {errors.email && errors.email.message && (
                    <ErrorText>{errors.email.message}</ErrorText>
                )}
                {isSignup && (
                    <>
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
                    </>
                )}

                <SInput
                    {...register("password", {
                        required: "비밀번호는 필수항목입니다.",
                        minLength: { value: 6, message: "최소 6자이상이여야 합니다." },
                    })}
                    type="password"
                    placeholder="비밀번호"
                    errors={errors.password}
                />
                {errors.password && errors.password.message && (
                    <ErrorText>{errors.password.message}</ErrorText>
                )}
                {isSignup && (
                    <>
                        <SInput
                            {...register("password1", {
                                required: "비밀번호 확인은 필수항목입니다.",
                                validate: (value) =>
                                    value === watch("password") || "비밀번호가 틀립니다.",
                            })}
                            type="password"
                            placeholder="비밀번호 확인"
                            errors={errors.password1}
                        />
                        {errors.password1 && errors.password1.message && (
                            <ErrorText>{errors.password1.message}</ErrorText>
                        )}
                    </>
                )}
                <Button disabled={disabled}>
                    {isSignup ? "회원가입👋" : "로그인👋"}
                </Button>
                <SText>
                    {isSignup ? (
                        <>
                            아이디가 있으신가요?
                            <span onClick={() => setIsSignup((prev) => !prev)}>
                                로그인하기
                            </span>
                        </>
                    ) : (
                        <>
                            아이디가 없으신가요?
                            <span onClick={() => setIsSignup((prev) => !prev)}>
                                회원가입하기
                            </span>
                        </>
                    )}
                </SText>
            </AuthContainer>
        </form>
    );
}

export default Auth;
