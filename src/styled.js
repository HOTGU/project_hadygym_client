import { createGlobalStyle } from "styled-components";
import Gmarket from "./font/GmarketSans.ttf";
import reset from "styled-reset";

export const GlobalStyles = createGlobalStyle` 
    ${reset}
    @font-face {
        font-family: "Gmarket";
        src: url(${Gmarket});
    }
    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
    }
    input,button {
        outline: none;
        border: none;
    }
    body {
        font-family: 'Noto Sans KR', sans-serif;
        font-size: 14px;
        background-color: ${(props) => props.theme.bgColor};
        color: ${(props) => props.theme.textColor};
        width: 100%;
        max-width: 1480px;
        margin: 0 auto;
        padding: 0px 10px;
    }
`;

export const darkTheme = {
    textColor: "#ffffff",
    svgColor: "#d2dae2",
    bgColor: "rgba(47, 54, 64, 1.0)", // British
    inputColor: "#1e272e",
    hoverColor: "black",
    accentColor: "#10ac84", // Canadian "DARK MOUNTAIN MEADOW"
    darkBtnColor: "#ff5e57",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    modalColor: "rgba(47, 54, 64, 0.8)",
    colors: {
        white: "white", // British "LYNX WHITE"
        red: "#e84118", // British "NASTURICIAN FLOWER"
    },
};

export const lightTheme = {
    textColor: "#2f3640",
    svgColor: "#485460",
    bgColor: "#f5f6fa", // British
    inputColor: "#ffffff",
    hoverColor: "#ecf0f1",
    accentColor: "#10ac84", // Canadian "DARK MOUNTAIN MEADOW"
    darkBtnColor: "#ffc048",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    modalColor: "rgba(47, 54, 64, 0.8)",
    colors: {
        white: "#f5f6fa",
        red: "#e84118",
    },
};
