import { useParams } from "react-router-dom";
import { WorkFindWorkById } from "../types/work";
import tw from "tailwind-styled-components";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { BACK_URL } from "../constant/constants";
import { Loading } from "../components/loading";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { FormError } from "../components/form-error";
import { CommentEntity } from "../types/comment";
import { Comments } from "../components/comments";

const Container = tw.div``;
const BackGround = tw.div`
    bg-gray-800
    py-40
    bg-cover
    bg-center
`;
const Content = tw.div`
    bg-white
    mx-20
    text-center
    h-auto
    py-5
`;
const CommentForm = tw.form`
    flex
    justify-center
    mt-10
`;
const CommentsWrapper = tw.div``;
const CommentError = tw.div`
    text-center
    mt-3
`;

const jwt = localStorage.getItem("jwt") ?? "";

interface IForm {
    content: string;
}

export const WorkById = () => {
    const { workId } = useParams<{ workId: string }>();

    const fetchFindWorkById = async (workId: string) => {
        return await (
            await axios.get(`${BACK_URL}/work/detail/${workId}`, { headers: { jwt } })
        ).data;
    };
    const { data: workData, isLoading: workIsLoading } = useQuery<WorkFindWorkById>(
        [workId, "fetchFindWorkById"],
        () => fetchFindWorkById(workId ?? ""),
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    //COMMENT-CREATE
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<IForm>({ mode: "onChange" });
    const onSubmit = async () => {
        const { content } = getValues();
        await axios.post(`${BACK_URL}/comment/create`, { content, workId: +(workId + "") }, { headers: { jwt } });
        refetch();
    };

    //COMMENT-READ
    const fetchComments = async () => {
        return await axios.get(`${BACK_URL}/comment/${workId}`, { headers: { jwt } });
    };
    const { data, isLoading, refetch } = useQuery([workId, "fetchComments"], fetchComments, {
        refetchOnWindowFocus: false,
        retry: 0,
    });

    if (workIsLoading) {
        return <Loading />;
    }

    return (
        <Container>
            <Helmet>
                <title>Work | Black Book</title>
            </Helmet>
            {!workIsLoading && (
                <BackGround style={{ backgroundImage: `url(${workData?.data.coverImg ?? null})` }}>
                    <Content>
                        <h4 className="text-3xl mb-3">
                            {workData?.data.title} ({workData?.data.state})
                        </h4>
                        <h5 className="text-xl font-light mb-2">{workData?.data.description}</h5>
                        <br />
                        <h6 className="text-lg font-bold">
                            Client Nick: {workData?.data.client?.nick}
                            <br />
                            Address: {workData?.data.address || "미입력"}
                        </h6>
                    </Content>
                    <CommentForm onSubmit={handleSubmit(onSubmit)}>
                        <input
                            className="w-1/2"
                            {...register("content", { required: "내용은 필수 입니다." })}
                            type={"content"}
                            placeholder=" content..."
                        />
                        <button className="bg-white py-2 px-1 rounded-md ml-5">Apply</button>
                    </CommentForm>
                    <CommentError>
                        {errors.content?.message && <FormError errorMessage={errors.content.message}></FormError>}
                    </CommentError>
                    <CommentsWrapper>
                        {!isLoading ? (
                            data?.data.data.map((comment: CommentEntity) => (
                                <Comments
                                    key={comment.id}
                                    id={comment.id}
                                    updatedAt={comment.updatedAt}
                                    content={comment.content}
                                    workId={+(workId + "")}
                                    writer={comment.writer}
                                />
                            ))
                        ) : (
                            <Loading />
                        )}
                    </CommentsWrapper>
                </BackGround>
            )}
        </Container>
    );
};
