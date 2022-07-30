import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import tw from "tailwind-styled-components";
import { Loading } from "../components/loading";
import { BACK_URL } from "../constant/constants";
import { WorkEntity, WorkManagement, workStatus } from "../types/work";

const Container = tw.div`
    flex
    flex-col
    items-center
    bg-gray-300
    h-screen
`;
const Wrapper = tw.div`
    flex
    w-full
`;
const WorkWrapper = tw.div`
    flex
    justify-around
    w-3/4
`;
const OptionWrapper = tw.div`
    flex
    justify-around
    w-1/4
`;
const ManagementButton = tw.button`
    bg-gray-500
    rounded-md
    text-white
`;
const ModalContainer = tw.div`
    absolute
    border
    top-1/3 left-1/3
    bg-white
    w-1/3 h-1/3
`;
const ModalWrapper = tw.div`
    flex
    justify-around
    mt-20
    w-full
`;
const ModalForm = tw.form`
    flex flex-col
    items-center
`;
const ModalButton = tw.button`
    bg-black
    text-white
    w-1/5
    mt-10
`;

const jwt = localStorage.getItem("jwt") ?? "";

export const Management = () => {
    const fetchReadMyWorks = async () => {
        const response = await axios.get(`${BACK_URL}/work`, { headers: { jwt } });
        return response.data;
    };
    const { data, isLoading, refetch } = useQuery<WorkManagement>("management", fetchReadMyWorks);
    const path = useLocation().pathname;

    //delete work
    const deleteWorkClick = async (workId: number) => {
        await axios.delete(`${BACK_URL}/work/delete/${workId}`, { headers: { jwt } });
        refetch();
    };

    //edit work state modal
    const [modal, setModal] = useState<{ isClick: boolean; workId: number }>({ isClick: false, workId: 0 });
    const editWorkStateClick = (workId: number) => {
        setModal({ isClick: true, workId });
    };
    const { register, handleSubmit, getValues } = useForm<{ state: string }>();
    const editWorkStateOnSubmit = async () => {
        await axios.get(`${BACK_URL}/work/my/${modal.workId}/${getValues().state}`, { headers: { jwt } });
        refetch();
    };

    return (
        <>
            <Container
                onClick={() => {
                    modal.isClick && setModal((modal) => ({ isClick: false, workId: 0 }));
                }}
            >
                <Helmet>
                    <title>Management | Black Book</title>
                </Helmet>
                {!isLoading && data ? (
                    data?.data.map((work: WorkEntity) => (
                        <Wrapper key={work.id}>
                            <WorkWrapper key={work.id}>
                                <div>No: {work.id}</div>
                                <div className="w-1/3">| 제목: {work.title}</div>
                                <div>| 비밀여부: {work.isSecret ? "O" : "X"}</div>
                                <div>| 상태: {work.state}</div>
                                <div>| 날짜: {work.updatedAt.toString().split("T")[0]}</div>
                            </WorkWrapper>
                            <OptionWrapper>
                                <Link to={`${path}/participant/${work.id}`}>
                                    <ManagementButton>참가자 편집</ManagementButton>
                                </Link>
                                <Link to={`${path}/work/${work.id}`}>
                                    <ManagementButton>작업 편집</ManagementButton>
                                </Link>
                                <div onClick={() => editWorkStateClick(work.id)}>
                                    <ManagementButton>상태 변경</ManagementButton>
                                </div>
                                <div onClick={() => deleteWorkClick(work.id)}>
                                    <ManagementButton>작업 삭제</ManagementButton>
                                </div>
                            </OptionWrapper>
                        </Wrapper>
                    ))
                ) : (
                    <Loading />
                )}
            </Container>
            {modal.isClick && (
                <ModalContainer>
                    <ModalForm onSubmit={handleSubmit(editWorkStateOnSubmit)}>
                        <ModalWrapper>
                            <div>
                                <input
                                    {...register("state")}
                                    type={"radio"}
                                    id={workStatus.Recruit}
                                    value={workStatus.Recruit}
                                />
                                <label htmlFor={workStatus.Recruit}>&nbsp;&nbsp;{workStatus.Recruit}</label>
                            </div>
                            <div>
                                <input
                                    {...register("state")}
                                    type={"radio"}
                                    id={workStatus.Progressing}
                                    value={workStatus.Progressing}
                                />
                                <label htmlFor={workStatus.Progressing}>&nbsp;&nbsp;{workStatus.Progressing}</label>
                            </div>
                            <div>
                                <input
                                    {...register("state")}
                                    type={"radio"}
                                    id={workStatus.Finished}
                                    value={workStatus.Finished}
                                />
                                <label htmlFor={workStatus.Finished}>&nbsp;&nbsp;{workStatus.Finished}</label>
                            </div>
                        </ModalWrapper>
                        <ModalButton>상태 변경</ModalButton>
                    </ModalForm>
                </ModalContainer>
            )}
        </>
    );
};
