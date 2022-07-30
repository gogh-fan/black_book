import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Loading } from "../components/loading";
import { BACK_URL } from "../constant/constants";
import { UserEntity } from "../types/user";
import { WorkFindWorkById } from "../types/work";
import tw from "tailwind-styled-components";
import React, { useState } from "react";
import { BackRespons } from "../types/interfaces";
import { Helmet } from "react-helmet-async";

const FormContainer = tw.div`
    flex
    flex-col
    items-center
`;
const FormWrapper = tw.div`
    flex 
    justify-evenly
    w-full
    mt-5
`;
const FormSpan = tw.span`
    text-left
    mr-3
`;
const FormInput = tw.input`
    border border-black
`;
const FormButton = tw.button`
    bg-black
    text-white
    px-2 py1
    border border-black
`;

const jwt = localStorage.getItem("jwt") ?? "";

interface IInviteForm {
    invite_nick: string;
}
interface IExcludeForm {
    exclude_nick: string;
}

export const EditParticipant = () => {
    const { workId } = useParams<{ workId: string }>();

    //participants
    const fetchMyWork = async (workId: string) => {
        try {
            const response = await axios.get(`${BACK_URL}/work/my/detail/${workId}`, { headers: { jwt } });
            return response.data;
        } catch (e: any) {
            return e.response.data;
        }
    };
    const {
        data: participantsData,
        isLoading,
        refetch,
    } = useQuery<WorkFindWorkById>([workId, "myWork"], () => fetchMyWork(workId + ""), {
        refetchOnWindowFocus: false,
        retry: 0,
    });

    //nick form
    const {
        register: inviteRegister,
        getValues: inviteGetValues,
        setValue: inviteSetValue,
        handleSubmit: inviteHandleSubmit,
    } = useForm<IInviteForm>({ mode: "onChange" });
    const {
        register: excludeRegister,
        getValues: excludeGetValues,
        setValue: excludeSetValue,
        handleSubmit: excludeHandleSubmit,
    } = useForm<IExcludeForm>({ mode: "onChange" });
    const fetchInvite = async () => {
        try {
            const response = await axios.post(
                `${BACK_URL}/work/invite`,
                {
                    id: workId,
                    nick: inviteGetValues().invite_nick,
                },
                { headers: { jwt } }
            );
            return response.data;
        } catch (e: any) {
            return e.response.data;
        }
    };
    const fetchExclude = async () => {
        try {
            const response = await axios.post(
                `${BACK_URL}/work/exclude`,
                {
                    id: workId,
                    nick: excludeGetValues().exclude_nick,
                },
                { headers: { jwt } }
            );
            return response.data;
        } catch (e: any) {
            return e.response.data;
        }
    };
    const { mutate: inviteMutation } = useMutation<BackRespons, BackRespons>(fetchInvite, {
        retry: 0,
        onSuccess: () => {
            inviteSetValue("invite_nick", "");
            refetch();
        },
    });
    const { mutate: excludeMutation } = useMutation<BackRespons, BackRespons>(fetchExclude, {
        retry: 0,
        onSuccess: () => {
            excludeSetValue("exclude_nick", "");
            refetch();
        },
    });
    const onInviteSubmit = () => {
        inviteMutation();
    };
    const onExcludeSubmit = () => {
        excludeMutation();
    };

    //nick auto-complete search
    const fetchAllNicks = async () => {
        try {
            const response = await axios.get(`${BACK_URL}/user/all-nicks`, { headers: { jwt } });
            return response.data;
        } catch (e: any) {
            return e.response.data;
        }
    };
    const { data: allNicks } = useQuery("allNicks", fetchAllNicks, {
        refetchOnWindowFocus: false,
        retry: 0,
    });
    const [inviteNicks, setInviteNicks] = useState([]);
    const onInviteChange = (e: React.FormEvent<HTMLInputElement>) => {
        inviteSetValue("invite_nick", e.currentTarget.value);
        const reg = new RegExp(inviteGetValues().invite_nick);
        const matchedInviteNicks = allNicks.data.filter((nick: string) => nick.match(reg));
        setInviteNicks(matchedInviteNicks);
    };
    const [excludeNicks, setExcludeNicks] = useState([]);
    const onExcludeChange = (e: React.FormEvent<HTMLInputElement>) => {
        excludeSetValue("exclude_nick", e.currentTarget.value);
        const reg = new RegExp(excludeGetValues().exclude_nick);
        const matchedExcludeNicks = allNicks.data.filter((nick: string) => nick.match(reg));
        setExcludeNicks(matchedExcludeNicks);
    };
    const inviteNickOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        inviteSetValue("invite_nick", e.currentTarget.innerText);
    };
    const excludeNickOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        excludeSetValue("exclude_nick", e.currentTarget.innerText);
    };

    return (
        <div>
            <Helmet>
                <title>Edit Participant | Black Book</title>
            </Helmet>
            <FormContainer>
                <FormWrapper>
                    <form className="w-1/2" onSubmit={inviteHandleSubmit(onInviteSubmit)}>
                        <FormSpan>참가자 초대</FormSpan>
                        <FormInput
                            {...inviteRegister("invite_nick", { required: true })}
                            onChange={onInviteChange}
                            placeholder=" Nick for invite"
                        />
                        <FormButton>초대</FormButton>
                    </form>
                    <form onSubmit={excludeHandleSubmit(onExcludeSubmit)}>
                        <FormSpan>참가자 내보내기</FormSpan>
                        <FormInput
                            {...excludeRegister("exclude_nick", { required: true })}
                            onChange={onExcludeChange}
                            placeholder=" Nick for exclude"
                        />
                        <FormButton>내보내기</FormButton>
                    </form>
                </FormWrapper>
            </FormContainer>
            {inviteNicks.length > 0 &&
                inviteNicks.map((nick: string) => (
                    <span
                        key={nick + Date.now().toString()}
                        className="bg-gray-300 absolute left-9 ml-40 pr-36"
                        onClick={inviteNickOnClick}
                    >
                        {nick.split("").map((c) => {
                            const reg = new RegExp(c);
                            return (
                                <span
                                    key={c + Date.now().toString()}
                                    className={`${inviteGetValues().invite_nick.match(reg) && "font-bold"}`}
                                >
                                    {c}
                                </span>
                            );
                        })}
                    </span>
                ))}
            {excludeNicks.length > 0 &&
                excludeNicks.map((nick: string) => (
                    <span
                        key={nick + Date.now().toString()}
                        className="bg-gray-300 absolute right-32 mr-14 pr-36"
                        onClick={excludeNickOnClick}
                    >
                        {nick.split("").map((c) => {
                            const reg = new RegExp(c);
                            return (
                                <span
                                    key={c + Date.now().toString()}
                                    className={`${excludeGetValues().exclude_nick.match(reg) && "font-bold"}`}
                                >
                                    {c}
                                </span>
                            );
                        })}
                    </span>
                ))}
            <div className="text-center">
                {!participantsData?.data.participants?.length && <div className="mt-3">참가자 없음</div>}
                {!isLoading ? (
                    participantsData?.data.participants?.map((participant: UserEntity) => (
                        <div key={participant.id}>{participant.nick}</div>
                    ))
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
};
