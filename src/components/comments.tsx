import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import tw from "tailwind-styled-components";
import { queryClient } from "..";
import { BACK_URL } from "../constant/constants";
import { FormError } from "./form-error";

const Container = tw.div``;
const Wrapper = tw.div`
    flex
    justify-center
`;
const CommentsWrapper = tw.div`
    text-center
    mt-5
    bg-white
    w-1/2
    flex
    justify-between
`;
const CommentsButton = tw.button`
    ml-3
    text-white
    rounded-md
    px-1
    mt-4
`;

const jwt = localStorage.getItem("jwt") ?? "";

interface ICommentsProps {
    id: number;
    updatedAt: Date;
    content: string;
    workId: number;
    writer: { nick: string };
}

export const Comments: React.FC<ICommentsProps> = ({ id, updatedAt, content, workId, writer }) => {
    const date = updatedAt.toString().split("T")[0];
    const deleteClick = async () => {
        await axios.delete(`${BACK_URL}/comment/delete/${id}`, { headers: { jwt } });
        queryClient.refetchQueries([workId + "", "fetchComments"]);
    };

    const [click, setClick] = useState(false);
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<{ editContent: string }>({ mode: "onChange" });
    const editClick = () => {
        setClick(!click);
    };
    const onSubmit = async () => {
        const { editContent } = getValues();
        await axios.post(`${BACK_URL}/comment/update`, { commentId: id, content: editContent }, { headers: { jwt } });
        setClick(false);
        queryClient.refetchQueries([workId + "", "fetchComments"]);
    };

    return (
        <Container>
            <Wrapper>
                <CommentsWrapper>
                    <span>{writer?.nick}</span>
                    <span>{content}</span>
                    <span>{date}</span>
                </CommentsWrapper>
                <CommentsButton onClick={editClick}>edit</CommentsButton>
                <CommentsButton onClick={deleteClick}>delete</CommentsButton>
            </Wrapper>
            {click && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center mt-2">
                    <input
                        {...register("editContent", { required: "내용은 필수 입니다." })}
                        type={"editContent"}
                        placeholder=" edit..."
                        size={93}
                    />
                    <button className="bg-white px-1 rounded-md ml-5">Apply</button>
                </form>
            )}
            <div className="text-center">
                {errors.editContent?.message && <FormError errorMessage={errors.editContent.message} />}
            </div>
        </Container>
    );
};
