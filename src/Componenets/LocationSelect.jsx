import React, { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { AngleRight } from "@styled-icons/fa-solid";
import AddressSearch from "./AddressSearch";

const Select = styled.div`
    display: inline-block;
    width: 70%;
    font-size: 16px;
    background-color: ${(props) => props.theme.inputColor};
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
    color: ${(props) => props.theme.textColor};
    cursor: pointer;
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    border-radius: 10px;
    & span {
        color: gray;
        font-weight: 100;
    }
`;
const SelectItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AngleIcon = styled(AngleRight)`
    width: 18px;
    height: 18px;
`;
function LocationSelect({ error, location, setValue }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Select onClick={() => setShow(!show)} className={error && "error"}>
                <SelectItem>
                    {location ? location : <span>희망동네</span>}
                    <AngleIcon />
                </SelectItem>
            </Select>
            <Modal show={show} setShow={setShow} title="희망동네">
                <AddressSearch setValue={setValue} show={show} setShow={setShow} />
            </Modal>
        </>
    );
}

export default LocationSelect;
