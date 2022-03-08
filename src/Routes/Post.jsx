import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Moment from "react-moment";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import Avatar from "../Componenets/Avatar";
import Modal from "../Componenets/Modal";
import Button from "../Componenets/Button";
import { getPostById } from "../api";
import Loader from "../Componenets/Loader";

const Wrapper = styled.div`
    margin: 20px auto;
    padding: 20px;
    box-shadow: ${(props) => props.theme.boxShadow};
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    min-height: 450px;
    background-color: ${(props) => props.theme.inputColor};
    display: flex;
    flex-direction: column;
`;

const Title = styled.h4`
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 5px;
`;
const TagWrapper = styled.div`
    display: flex;
    padding-bottom: 10px;
`;
const Tag = styled.div`
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 16px;
    margin-right: 5px;
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.colors.white};
`;
const Created = styled.div`
    font-weight: 100;
    font-size: 14px;
    opacity: 0.87;
    margin-bottom: 20px;
`;
const Description = styled.div`
    font-size: 18px;
    font-weight: 100;
    margin-bottom: 40px;
    white-space: pre-wrap;
    line-height: 1.5rem;
`;
const CreatorWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 20px;
    & button {
        padding: 10px 15px;
        background-color: ${(props) => props.theme.accentColor};
        color: ${(props) => props.theme.colors.white};
        font-family: "GMarket";
        outline: none;
        border: none;
        cursor: pointer;
    }
`;
const Creator = styled.div`
    display: flex;
    align-items: center;
    & span {
        font-size: 20px;
        margin-left: 10px;
    }
`;
const SForm = styled.form`
    width: auto;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & span {
        font-weight: 100;
        margin-bottom: 5px;
    }
    & textarea {
        width: 100%;
        min-width: 280px;
        height: 200px;
        overflow: scroll-y;
        resize: none;
        padding: 5px;
        font-size: 16px;
        background-color: ${(props) => props.theme.inputColor};
        color: ${(props) => props.theme.textColor};
        border: 1px solid
            ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
        margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
        border-radius: 5px;
    }
`;

function Post() {
    const [show, setShow] = useState(false);
    const { id } = useParams();
    const [post, setPost] = useState();
    const { state } = useLocation();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm();

    const onValid = (data) => {
        setShow(!show);
    };

    const getPost = useCallback(
        async (id) => {
            try {
                setLoading(true);
                const { data } = await getPostById(id);
                setPost(data);
                setLoading(false);
            } catch {
                history.push("/");
            }
        },
        [history]
    );

    // const getPost = async (id) => {
    //     try {
    //         setLoading(true);
    //         const { data } = await getPostById(id);
    //         setPost(data);
    //         setLoading(false);
    //     } catch {
    //         navigate("/");
    //     }
    // };

    useEffect(() => {
        if (state?.post) {
            setPost(state.post);
        }
        if (!state?.post) {
            getPost(id);
        }
    }, [state?.post, getPost, id]);

    if (loading) return <Loader width="50px" height="50px" />;

    return (
        <Wrapper>
            <Title>{post?.title}</Title>
            <Created>
                <Moment format="YYYY년 MM월 DD일">{post?.created}</Moment>
            </Created>
            <TagWrapper>
                <Tag>{post?.location}</Tag>
                <Tag>{post?.category}</Tag>
            </TagWrapper>
            <Description>{post?.description}</Description>
            <CreatorWrapper>
                <Creator>
                    <Avatar src={post?.creator?.avatar} width="60px" height="60px" />
                    <span>{post?.creator?.nickname}</span>
                </Creator>
                {true && <button onClick={() => setShow(!show)}>✉ 쪽지 보내기</button>}
            </CreatorWrapper>
            <Modal show={show} setShow={setShow} title={`쪽지보내기`}>
                <SForm onSubmit={handleSubmit(onValid)}>
                    <textarea {...register("message")} />
                    <Button>보내기</Button>
                </SForm>
            </Modal>
        </Wrapper>
    );
}

export default Post;
