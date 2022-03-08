import React from "react";
import HomeImg from "../Images/homeImg.svg";
import styled from "styled-components";
import LinkBtn from "../Componenets/LinkBtn";
import SvgLeaf from "../Componenets/Images/Leaf";
import SvgFlower from "../Componenets/Images/Flower";
import SvgTree from "../Componenets/Images/Tree";

const HomeContainer = styled.div`
    margin: 20px auto;
    max-width: 1400px;
`;
const MainWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
    }
`;
const MainItem = styled.div`
    width: 46%;
    flex-basis: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        padding: 0;
    }
`;

const MainImg = styled.img`
    width: 100%;
    height: auto;
    @media screen and (max-width: 1024px) {
        width: 80%;
    }
    @media screen and (max-width: 768px) {
        width: 100%;
    }
`;
const MainText = styled.div`
    margin-bottom: 30px;
    font-size: 32px;
    @media screen and (max-width: 1024px) {
        font-size: 24px;
    }
`;

const ItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 100px auto;
    @media screen and (max-width: 1024px) {
        flex-direction: column;
    }
`;
const Item = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1024px) {
        width: 100%;
        margin-bottom: 20px;
        flex-direction: row;
        justify-content: flex-start;
    }
`;

const ItemText = styled.div`
    color: ${(props) => props.theme.textColor};
    font-size: 18px;
    margin-top: 20px;
`;

function Home() {
    return (
        <HomeContainer>
            <MainWrapper>
                <MainItem>
                    <MainImg src={HomeImg} />
                </MainItem>
                <MainItem>
                    <MainText>자신에게 맞는 운동프로를 찾아보세요</MainText>
                    <LinkBtn to="/posts/upload" padding="25px 40px" fontSize="24px">
                        프로 찾으러 가기
                    </LinkBtn>
                </MainItem>
            </MainWrapper>
            <ItemWrapper>
                <Item>
                    <SvgLeaf width="100px" height="100px" />
                    <ItemText>운동프로를 구하는 글을 올립니다</ItemText>
                </Item>
                <Item>
                    <SvgFlower width="100px" height="100px" />
                    <ItemText>쪽지가 온 운동프로의 프로필을 봅니다</ItemText>
                </Item>
                <Item>
                    <SvgTree width="100px" height="100px" />
                    <ItemText>마음에 든 운동프로와 같이 운동을 합니다</ItemText>
                </Item>
            </ItemWrapper>
        </HomeContainer>
    );
}

export default Home;
