import React, { useRef, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import styled from "styled-components";
import toast from "react-hot-toast";
import { Sun, Moon, Bars } from "@styled-icons/fa-solid";

import { isDarkAtom } from "../atoms/isDarkAtom";
import { isAuthAtom } from "../atoms/isAuthAtom";
import { logoutApi } from "../api";
import { logoutHandler } from "../utils/auth";
import useOutsideClick from "../hooks/useOutsideClick";
import Avatar from "./Avatar";
import { resetPostsSelector } from "../atoms/postsAtom";
import { resetMePostsSelector } from "../atoms/mePostsAtom";
import Confirm from "./Confirm";

const NavbarContainer = styled.header`
    border-bottom: 1px solid ${(props) => props.theme.svgColor};
`;
const SNavbar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    margin: 0 auto;
`;
const TitleWrapper = styled.div`
    position: relative;
`;
const DarkToggleBtn = styled.button`
    position: absolute;
    top: 50%;
    right: -50px;
    margin-top: -15px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.textColor};
    color: ${(props) => props.theme.darkBtnColor};
    border: none;
    font-size: 16px;
    cursor: pointer;
`;

const TitleLink = styled(NavLink)`
    font-family: "Gmarket";

    color: ${(props) => props.theme.accentColor};
    font-weight: 700;
    display: flex;
    flex-direction: column;
    align-items: center;
    & h1:last-child {
        margin-top: 5px;
        font-size: 40px;
    }
`;

const NavWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const NavItem = styled(Link)`
    padding: 14px;
    color: ${(props) => props.theme.textColor};
    font-size: 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

const UserModalWrapper = styled.div`
    position: relative;
    border: 1px solid ${(props) => props.theme.textColor};
    border-radius: 20px;
    padding: 4px 8px;
    z-index: 99;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;
const Bar = styled(Bars)`
    width: 18px;
    height: 18px;
    margin-right: 12px;
`;
const UserModal = styled.div`
    position: absolute;
    right: 0;
    top: 34px;
    width: 150px;
    height: auto;
    border-radius: 10px;
    margin-top: 10px;
    box-shadow: ${(props) => props.theme.boxShadow};
    padding: 10px 0;
    background-color: ${(props) => props.theme.inputColor};
`;
const ModalItem = styled.div`
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.1s ease-in-out;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

function Navbar() {
    const history = useHistory();
    const [isDark, setIsDark] = useRecoilState(isDarkAtom);
    const [isAuth, setIsAuth] = useRecoilState(isAuthAtom);
    const resetPosts = useResetRecoilState(resetPostsSelector);
    const resetMePosts = useResetRecoilState(resetMePostsSelector);
    const [modal, setModal] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const modalRef = useRef();

    const toggleDark = () => {
        localStorage.setItem("isDark", !isDark);
        setIsDark((prev) => !prev);
    };

    useOutsideClick(modalRef, () => {
        if (modal) setModal(false);
    });

    const handleLogout = async (e) => {
        const logoutPromise = logoutApi()
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                logoutHandler();
                history.push("/");
                setModal(false);
                setConfirm(false);
                setIsAuth({ loggedIn: false, userInfo: {} });
                resetPosts();
                resetMePosts();
            });

        toast.promise(logoutPromise, {
            loading: "로그아웃 중...",
            success: "다음에 또 봐요",
            error: "로그아웃 실패",
        });
    };

    return (
        <NavbarContainer>
            <SNavbar>
                <TitleWrapper>
                    <TitleLink to="/">
                        <h1>Handy GYM</h1>
                        <h1>핸디짐</h1>
                    </TitleLink>
                    <DarkToggleBtn onClick={toggleDark}>
                        {isDark ? <Sun /> : <Moon />}
                    </DarkToggleBtn>
                </TitleWrapper>
                <NavWrapper>
                    {isAuth?.loggedIn ? (
                        <>
                            <NavItem to="/pro" fontSize="14px">
                                운동프로되기
                            </NavItem>
                            <UserModalWrapper onClick={() => setModal(!modal)}>
                                <Bar />
                                <Avatar
                                    width="30px"
                                    height="30px"
                                    click={true}
                                    src={isAuth.userInfo.avatar}
                                />

                                {modal && (
                                    <UserModal ref={modalRef}>
                                        <Link to="/me" onClick={() => setModal(false)}>
                                            <ModalItem>내 프로필</ModalItem>
                                        </Link>
                                        <ModalItem
                                            onClick={() => {
                                                setModal(false);
                                                setConfirm(true);
                                            }}
                                        >
                                            로그아웃
                                        </ModalItem>
                                    </UserModal>
                                )}
                            </UserModalWrapper>
                            {confirm && (
                                <Confirm
                                    title="정말 로그아웃 하십니까?"
                                    setShow={setConfirm}
                                    onConfirm={handleLogout}
                                />
                            )}
                        </>
                    ) : (
                        <NavItem to="/auth" fontSize="14px">
                            로그인
                        </NavItem>
                    )}
                </NavWrapper>
            </SNavbar>
        </NavbarContainer>
    );
}

export default Navbar;
