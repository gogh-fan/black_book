import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { FormError } from "../components/form-error";
import { BACK_URL } from "../constant/constants";
import tw from "tailwind-styled-components";
import { BackRespons } from "../types/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { WorkEntity } from "../types/work";

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
    id: string;
    title: string;
    description: string;
    address?: string;
    coverImg?: string;
    isSecret: number;
}

const jwt = localStorage.getItem("jwt") ?? "";

export const EditWork = () => {
    const { workId } = useParams<{ workId: string }>();
    const { register, getValues, handleSubmit } = useForm<IForm>({ mode: "onChange" });

    // find work by id
    const fetchFindWorkById = async () => {
        const response = await axios.get(`${BACK_URL}/work/detail/${workId}`, { headers: { jwt } });
        return response.data.data;
    };
    const { data: workData } = useQuery<WorkEntity>([workId, "edit-profile"], fetchFindWorkById, {
        refetchOnWindowFocus: false,
        retry: 0,
    });

    // edit work
    const navigate = useNavigate();
    const fetchEditWork = async (data: any) => {
        try {
            const { title, description, address, isSecret } = getValues();
            const secret = isSecret > 0 ? true : false;
            const response = await axios.post(
                `${BACK_URL}/work/update`,
                { id: workId, title, description, address, coverImg: data ?? undefined, isSecret: secret },
                { headers: { jwt } }
            );
            return response.data;
        } catch (error: any) {
            throw new Error("비밀회원이 아닙니다.");
        }
    };
    const { mutate: editWorkMutate, error } = useMutation<BackRespons, { message: string }>(fetchEditWork, {
        retry: 0,
        onSuccess: () => {
            alert("수정 완료");
            navigate("/menu/management");
        },
        onError: (e) => {
            alert(e.message);
        },
    });

    // edit coverImg
    const fetchUploadImg = async () => {
        // fake path issue
        // @ts-ignore
        const file: File = document.getElementById("file").files[0];
        const form = new FormData();
        form.append("coverImg", file);
        const { data } = await (
            await fetch(`${BACK_URL}/upload`, {
                method: "POST",
                body: form,
            })
        ).json();
        return data;
    };
    const { mutate: uploadMutate } = useMutation(fetchUploadImg, {
        onSuccess: (data) => {
            editWorkMutate(data);
        },
    });
    const fetchEditImg = async (coverImg: string | undefined) => {
        if (!coverImg) {
            uploadMutate();
            return;
        }
        const [bucket, key] = coverImg.slice(8).split(".s3.amazonaws.com/");
        await axios.delete(`${BACK_URL}/upload/${bucket}/${key}`);
        uploadMutate();
    };

    //onSubmit
    const onSubmit: SubmitHandler<IForm> = async (data) => {
        // fake path issue
        // @ts-ignore
        const file: File = document.getElementById("file").files[0];
        if (file !== undefined) fetchEditImg(workData?.coverImg);
        else editWorkMutate();
    };

    return (
        <>
            <Helmet>
                <title>Edit Work | Black Book</title>
            </Helmet>
            <CreateWorkForm onSubmit={handleSubmit(onSubmit)}>
                <CreateWorkTitle {...register("title")} defaultValue={workData?.title} placeholder=" Title" />
                <CreateWorkDescription
                    {...register("description")}
                    defaultValue={workData?.description}
                    placeholder=" Description"
                />
                <CreateWorkOption>
                    <input
                        {...register("address")}
                        defaultValue={workData?.address}
                        className="border border-black w-1/2"
                        placeholder=" Address..."
                    />
                    <select {...register("isSecret")} className="border w-1/3">
                        <option value={""}>비밀 여부(기본값: X)</option>
                        <option value={0}>X</option>
                        <option value={1}>O</option>
                    </select>
                    <input {...register("coverImg")} id="file" className="hidden" type={"file"} />
                    <label htmlFor="file" className="border border-black bg-gray-300 rounded-md cursor-pointer">
                        이미지 첨부
                    </label>
                </CreateWorkOption>
                <CreateWorkButton>작업 수정</CreateWorkButton>
                {error && <FormError errorMessage={error.message} />}
            </CreateWorkForm>
        </>
    );
};
