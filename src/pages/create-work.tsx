import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { FormError } from "../components/form-error";
import { BACK_URL } from "../constant/constants";
import tw from "tailwind-styled-components";
import { BackRespons } from "../types/interfaces";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CreateWorkForm = tw.form`
    flex
    flex-col
    items-center
    mt-10
`;
const CreateWorkTitle = tw.input`
    w-1/2
    h-10
    border
    border-black
`;
const CreateWorkDescription = tw.textarea`
    w-1/2
    mt-3
    h-48
    border
    border-black
`;
const CreateWorkOption = tw.div`
    mt-3
    w-1/2
    flex
    justify-between
`;
const CreateWorkButton = tw.button`
    mt-10
    bg-black
    text-white
    px-1 py-2
    rounded-md
    transition-colors
    hover:bg-gray-500
`;

interface IForm {
    title: string;
    description: string;
    address?: string;
    coverImg?: string;
    isSecret: number;
}

const jwt = localStorage.getItem("jwt") ?? "";

export const CreateWork = () => {
    const {
        register,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<IForm>({ mode: "onChange" });

    const navigate = useNavigate();
    const fetchCreateWork = async () => {
        try {
            const { title, description, address, coverImg, isSecret } = getValues();
            const secret = isSecret > 0 ? true : false;
            const response = await axios.post(
                `${BACK_URL}/work/create`,
                { title, description, address, coverImg, isSecret: secret },
                { headers: { jwt } }
            );
            return response.data;
        } catch (error: any) {
            throw new Error("비밀회원이 아닙니다.");
        }
    };
    const { mutate, error } = useMutation<BackRespons, { message: string }>(fetchCreateWork, {
        retry: 0,
        onSuccess: (data) => {
            alert("작성 완료");
            navigate("/");
        },
        onError: (e) => {
            alert(e.message);
        },
    });
    const onSubmit: SubmitHandler<IForm> = async (data) => {
        if (data.coverImg) {
            const form = new FormData().append("coverImg", data.coverImg);
            const uploadResponse = await axios.post(`${BACK_URL}/upload`, form, {
                withCredentials: true,
                headers: { jwt },
            });
            setValue("coverImg", uploadResponse.data.data);
        }
        mutate();
    };

    return (
        <>
            <Helmet>
                <title>Create Work | Black Book</title>
            </Helmet>
            <CreateWorkForm onSubmit={handleSubmit(onSubmit)}>
                <CreateWorkTitle {...register("title", { required: "제목은 필수 입니다." })} placeholder=" Title" />
                {errors.title?.message && <FormError errorMessage={errors.title.message} />}
                <CreateWorkDescription
                    {...register("description", { required: "내용은 필수 입니다." })}
                    placeholder=" Description"
                />
                {errors.description?.message && <FormError errorMessage={errors.description.message} />}
                <CreateWorkOption>
                    <input {...register("address")} className="border border-black w-1/2" placeholder=" Address..." />
                    <select {...register("isSecret")} defaultValue={0} className="border w-1/3">
                        <option value={""}>비밀 여부</option>
                        <option value={0}>X</option>
                        <option value={1}>O</option>
                    </select>
                    <input {...register("coverImg")} id="file" className="hidden" type={"file"} />
                    <label htmlFor="file" className="border border-black bg-gray-300 rounded-md cursor-pointer">
                        이미지 첨부
                    </label>
                </CreateWorkOption>
                <CreateWorkButton>작업 등록</CreateWorkButton>
                {error && <FormError errorMessage={error?.message} />}
            </CreateWorkForm>
        </>
    );
};
