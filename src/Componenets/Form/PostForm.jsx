import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { InfoCircle } from "@styled-icons/fa-solid";
import { toast } from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import { useResetRecoilState } from "recoil";

import CategorySelect from "../CategorySelect";
import LocationSelect from "../LocationSelect";
import useBlockEnter from "../../hooks/useBlockEnter";
import Button from "../Button";
import { createPostApi, updatePostApi } from "../../api";
import { resetPostsSelector } from "../../atoms/postsAtom";
import Loader from "../Loader";

const SForm = styled.form`
    width: 100%;
    max-width: 600px;
    & .error {
        border: 1px solid ${(props) => props.theme.colors.red};
    }
`;
const SInput = styled.input.attrs({ autoComplete: "off" })`
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    background-color: ${(props) => props.theme.inputColor};
    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.borderColor)};
    padding: 15px 10px;
    border-radius: 5px;
`;
const Flex = styled.div`
    display: flex;
    gap: 10px;
`;
const Column = styled.div`
    margin-bottom: 10px;
`;
const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: 240px;
    font-weight: 100;

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.borderColor)};
    background-color: ${(props) => props.theme.inputColor};
    padding: 10px;
    font-size: 16px;
    outline: none;
    border-radius: 5px;
`;
const ErrorText = styled.div`
    color: ${(props) => props.theme.colors.red};
    margin-bottom: 2px;
`;
const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    color: ${(props) => props.theme.svgColor};
`;
const InfoText = styled.div`
    font-size: 14px;
    font-weight: 100;
`;
const InfoEmoji = styled(InfoCircle)`
    height: 14px;
    margin-right: 3px;
`;

function PostForm({ isUpdate, post }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const resetPosts = useResetRecoilState(resetPostsSelector);
    const history = useHistory();
    const { id } = useParams();

    const categoryRef = useRef();
    const locationRef = useRef();

    const category = watch("category");
    const location = watch("location");

    useBlockEnter();

    useEffect(() => {
        if (isUpdate) {
            setValue("title", post?.title);
            setValue("description", post?.description);
            setValue("category", post?.category);
            setValue("location", post?.location);
        }
    });

    const onValid = async (data) => {
        setLoading(true);
        if (isUpdate) {
            try {
                await updatePostApi(id, data);
                toast.success("?????? ??????");
                resetPosts();
                history.push("/me");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            try {
                await createPostApi(data);
                toast.success("????????? ??????");
                resetPosts();
                history.push("/posts");
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        setLoading(false);
    };

    return (
        <SForm onSubmit={handleSubmit(onValid)}>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>?????? ????????? ??? ???????????? ???????????????</InfoText>
                </InfoWrapper>

                <SInput
                    {...register("title", {
                        required: "????????? ?????????????????????",
                        minLength: {
                            value: 2,
                            message: "?????? 2?????????????????? ?????????.",
                        },
                        maxLength: { value: 20, message: "?????? 20????????????." },
                    })}
                    placeholder="??????"
                    className={errors.title && "error"}
                />
                {errors.title && errors.title.message && (
                    <ErrorText>{errors.title.message}</ErrorText>
                )}
            </Column>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>????????? ????????? ????????? ????????? ??????????????????</InfoText>
                </InfoWrapper>

                <Flex>
                    <CategorySelect
                        error={errors.category}
                        category={category}
                        setValue={setValue}
                    />
                    <LocationSelect
                        error={errors.location}
                        location={location}
                        setValue={setValue}
                    />
                </Flex>
                {errors.category && errors.category.message && (
                    <ErrorText>{errors.category.message}</ErrorText>
                )}
                {errors.location && errors.location.message && (
                    <ErrorText>{errors.location.message}</ErrorText>
                )}
            </Column>
            <Column>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>????????? ????????? ????????? ????????? ???????????? ???????????????</InfoText>
                </InfoWrapper>
                <InfoWrapper>
                    <InfoEmoji />
                    <InfoText>???????????? ????????? ???????????????????</InfoText>
                </InfoWrapper>

                <TextArea
                    {...register("description", {
                        required: "????????? ?????????????????????",
                        minLength: {
                            value: 15,
                            message: "?????? 15?????????????????? ?????????.",
                        },
                        maxLength: { value: 200, message: "?????? 200????????????." },
                    })}
                    placeholder="??????"
                    className={errors.description && "error"}
                />
                {errors.description && errors.description.message && (
                    <ErrorText>{errors.description.message}</ErrorText>
                )}
            </Column>

            <SInput
                ref={categoryRef}
                {...register("category", {
                    required: "??????????????? ?????????????????????",
                })}
                readOnly={true}
                hidden={true}
            />
            <SInput
                ref={locationRef}
                {...register("location", {
                    required: "??????????????? ?????????????????????",
                })}
                readOnly={true}
                hidden={true}
            />
            <Button disabled={loading}>
                {loading ? (
                    <Loader isCenter={false} />
                ) : (
                    <div>{isUpdate ? "????????????" : "?????????"}</div>
                )}
            </Button>
        </SForm>
    );
}

export default PostForm;
