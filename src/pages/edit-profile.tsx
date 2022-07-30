import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { BACK_URL } from "../constant/constants";
import { BackRespons } from "../types/interfaces";

const Container = tw.div`
h-screen
flex
flex-col
items-center
mt-10
lg:mt-28
`;
const Wrapper = tw.div`
w-full
max-w-screen-sm
flex
flex-col
items-center
px-5
`;
const SignUpH4 = tw.h4`
w-full
font-bold
text-left
text-2xl
mb-5
`;
const SignUpForm = tw.form`
grid
mt-5
gap-3
mb-3
w-full
`;
const OptionButton = tw.button`
    py-1 px-2 border border-black rounded-md
    hover:bg-black
    hover:text-white
`;

const jwt = localStorage.getItem("jwt") ?? "";

interface IForm {
    email?: string;
    password?: string;
}

export const EditProFile = () => {
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IForm>({ mode: "onChange" });

    const fetchEditProfile = async ({ email, password }: IForm) => {
        try {
            const response = await axios.post(
                `${BACK_URL}/user/edit`,
                {
                    email,
                    password,
                },
                { headers: { jwt: localStorage.getItem("jwt") + "" } }
            );
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    };
    const { mutate, isLoading, error } = useMutation<BackRespons, BackRespons>(() => fetchEditProfile(getValues()), {
        retry: 0,
        onSuccess: () => {
            alert("유저 정보를 변경 하였습니다.");
        },
        //onError: (e) => console.log(e),
    });

    const onSubmit = () => {
        mutate();
    };

    const navigate = useNavigate();
    const onDeleteUserClick = async () => {
        if (window.confirm("회원 탈퇴 하시겠습니까?")) {
            const password = window.prompt("비밀번호를 입력 해주세요.");
            try {
                await axios.post(`${BACK_URL}/user/delete`, { password }, { headers: { jwt } });
                localStorage.removeItem("jwt");
                navigate("/", { replace: true });
                window.location.reload();
            } catch (error: any) {
                const e: string = error.response?.data.error?.message;
                window.alert(e ?? error.response?.data.message);
            }
        }
    };
    const onResendEmailClick = async () => {
        await axios.get(`${BACK_URL}/user/email-resend`, { headers: { jwt } });
    };

    const [isVerified, setIsVerified] = useState(false);
    useEffect(() => {
        const isVerifiedQuery = async () => {
            try {
                const response = await axios.get(`${BACK_URL}/user/me`, { headers: { jwt } });
                setIsVerified(response.data.data.verified);
            } catch (error) {
                setIsVerified(false);
            }
        };

        isVerifiedQuery();
    }, []);

    return (
        <Container>
            <Wrapper>
                <Helmet>
                    <title>Edit Profile | Black Book</title>
                </Helmet>
                <SignUpH4>Edit Profile</SignUpH4>
                <SignUpForm onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("email", {
                            pattern: {
                                // eslint-disable-next-line no-useless-escape
                                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "올바른 이메일 형식이 아닙니다.",
                            },
                        })}
                        className="input"
                        type="email"
                        placeholder="Email"
                    />
                    {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
                    <input
                        {...register("password", {
                            minLength: { value: 6, message: "최소 6자 이상 입니다." },
                        })}
                        className="input"
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                    />
                    {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
                    <Button canClick={isValid} loading={isLoading} actionText={"Edit Profile"} />
                    {error && <FormError errorMessage={error.error?.message ?? error.error + ""} />}
                </SignUpForm>
                <div className="flex justify-between w-full">
                    <div className="py-1 px-2 border border-black rounded-md">
                        이메일 인증 여부: {isVerified ? "O" : "X"}
                    </div>
                    <OptionButton role="userDeleteButton" onClick={onDeleteUserClick}>
                        회원 탈퇴
                    </OptionButton>
                    {isVerified ? <></> : <OptionButton onClick={onResendEmailClick}>이메일 인증 재전송</OptionButton>}
                </div>
            </Wrapper>
        </Container>
    );
};
