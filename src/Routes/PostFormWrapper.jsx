import React from "react";
import styled from "styled-components";

import Img from "../Images/uploadImg.svg";
import PostForm from "../Componenets/Form/PostForm";

const PostContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
        margin-top: 20px;
    }
`;
const PostItem = styled.div`
    width: 40%;
    flex-basis: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
    }
`;
const PostImg = styled.img`
    width: 100%;
    max-width: 550px;
    height: auto;
`;
const Title = styled.div`
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
`;

function PostFormWrapper({ isUpdate, post, title }) {
    return (
        <PostContainer>
            <PostItem>
                <PostImg src={Img} />
            </PostItem>
            <PostItem>
                <Title>{title}</Title>
                <PostForm isUpdate={isUpdate} post={post} />
            </PostItem>
        </PostContainer>
    );
}

export default PostFormWrapper;
