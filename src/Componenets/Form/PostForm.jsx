import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { InfoCircle } from "@styled-icons/fa-solid";
import { toast } from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import CategorySelect from "../CategorySelect";
import LocationSelect from "../LocationSelect";
import Button from "../Button";
import { createPostApi, updatePostApi } from "../../api";
import {
    fetchPostsIsFetch,
    fetchPostsLoadLimit,
    postsState,
} from "../../atoms/postsAtom";

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
    font-weight: 600;
    background-color: ${(props) => props.theme.inputColor};
    transition: background-color 0.2s ease-in-out;
    font-weight: 100;
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
    &::placeholder {
        font-size: 16px;
        color: gray;
    }
    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    padding: 15px 10px;
    margin-bottom: ${(props) => (props.errors ? "5px" : "10px")};
    border-radius: 10px;
`;
const Flex = styled.div`
    display: flex;
    gap: 10px;
`;
const TextArea = styled.textarea`
    resize: none;
    width: 100%;
    height: 240px;
    font-weight: 100;

    color: ${(props) => props.theme.textColor};
    border: 1px solid
        ${(props) => (props.errors ? props.theme.colors.red : props.theme.textColor)};
    background-color: ${(props) => props.theme.inputColor};
    padding: 10px;
    font-size: 16px;
    outline: none;
    border-radius: 10px;
    margin-bottom: 10px;
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
    const [posts, setPosts] = useRecoilState(postsState);
    const postsLimit = useRecoilValue(fetchPostsLoadLimit);
    const setIsFetch = useSetRecoilState(fetchPostsIsFetch);
    const history = useHistory();
    const { id } = useParams();

    const categoryRef = useRef();
    const locationRef = useRef();

    const category = watch("category");
    const location = watch("location");

    const blockEnter = (e) => {
        if (e.keyCode === 13 && e.target.type !== "textarea") {
            e.preventDefault();
            return false;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", blockEnter);
        if (isUpdate) {
            setValue("title", post?.title);
            setValue("description", post?.description);
            setValue("category", post?.category);
            setValue("location", post?.location);
        }
        return () => {
            window.removeEventListener("keydown", blockEnter);
        };
    });

    const onValid = async (data) => {
        if (isUpdate) {
            const updatePromise = updatePostApi(id, data)
                .catch((err) => {
                    console.log(err);
                })
                .then(({ data }) => {
                    // const updated = posts.filter((post) => {
                    //     if (post._id === data._id) {
                    //         return (post = data);
                    //     } else {
                    //         return post;
                    //     }
                    // });
                    // setPosts(updated);
                    history.push("/me");
                });
            toast.promise(updatePromise, {
                loading: "수정 중..",
                success: "수정 성공",
                error: "수정 실패",
            });
        } else {
            const createPromise = createPostApi(data)
                .catch((err) => {
                    console.log(err);
                })
                .then(({ data }) => {
                    const postsLength = posts.length;
                    if (Number.isInteger(postsLength / postsLimit)) {
                        setIsFetch(true);
                        const filtered = posts.filter(
                            (__, index) => index + 1 !== postsLength
                        );
                        setPosts([data, ...filtered]);
                    } else {
                        setPosts([data, ...posts]);
                    }
                    history.push("/posts");
                });

            toast.promise(createPromise, {
                loading: "업로드 중..",
                success: "업로드 성공",
                error: "업로드 실패",
            });
        }
    };

    return (
        <SForm onSubmit={handleSubmit(onValid)}>
            <InfoWrapper>
                <InfoEmoji />
                <InfoText>글의 주제를 한 문장으로 적어보세요</InfoText>
            </InfoWrapper>
            {errors.title && errors.title.message && (
                <ErrorText>{errors.title.message}</ErrorText>
            )}
            <SInput
                {...register("title", {
                    required: "제목은 필수항목입니다",
                    minLength: {
                        value: 2,
                        message: "최소 2자이상이여야 합니다.",
                    },
                    maxLength: { value: 20, message: "최대 20자입니다." },
                })}
                placeholder="제목"
                className={errors.title && "error"}
            />
            <InfoWrapper>
                <InfoEmoji />
                <InfoText>자신이 원하는 운동과 동네를 선택해주세요</InfoText>
            </InfoWrapper>
            {errors.category && errors.category.message && (
                <ErrorText>{errors.category.message}</ErrorText>
            )}
            {errors.location && errors.location.message && (
                <ErrorText>{errors.location.message}</ErrorText>
            )}
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
            <InfoWrapper>
                <InfoEmoji />
                <InfoText>자신이 원하는 프로의 모습을 자세하게 적어주세요</InfoText>
            </InfoWrapper>
            <InfoWrapper>
                <InfoEmoji />
                <InfoText>인삿말을 빼놓지 말아주세요😀</InfoText>
            </InfoWrapper>
            {errors.description && errors.description.message && (
                <ErrorText>{errors.description.message}</ErrorText>
            )}
            <TextArea
                {...register("description", {
                    required: "본문은 필수항목입니다",
                    minLength: {
                        value: 15,
                        message: "최소 15자이상이여야 합니다.",
                    },
                    maxLength: { value: 200, message: "최대 200자입니다." },
                })}
                placeholder="본문"
                className={errors.description && "error"}
            />

            <SInput
                ref={categoryRef}
                {...register("category", {
                    required: "희망운동은 필수항목입니다",
                })}
                readOnly={true}
                hidden={true}
            />
            <SInput
                ref={locationRef}
                {...register("location", {
                    required: "희망동네는 필수항목입니다",
                })}
                readOnly={true}
                hidden={true}
            />
            <Button
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        return false;
                    }
                }}
            >
                {isUpdate ? "수정하기" : "업로드"}
            </Button>
        </SForm>
    );
}

export default PostForm;
