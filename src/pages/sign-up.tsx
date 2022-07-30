import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { BACK_URL } from "../constant/constants";
import tw from "tailwind-styled-components";

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

interface IForm {
    nick: string;
    password: string;
    email: string;
}

export const SignUp = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IForm>({ mode: "onChange" });

    const fetchSignUp = async ({ nick, password, email }: IForm) => {
        try {
            setLoading(true);
            await axios.post(`${BACK_URL}/user/signup`, {
                nick,
                password,
                email,
            });
        } catch (error: any) {
            const e: string = error.response?.data.error?.message;
            setLoading(false);
            return e ?? error.response?.data.message;
        }

        setLoading(false);
    };
    const onSubmit = async () => {
        if (!loading) {
            const { nick, password, email } = getValues();
            const e = await fetchSignUp({ nick, password, email });
            if (!e) {
                alert("회원가입 완료");
                navigate("/login", { replace: true });
            } else {
                setError(e);
            }
        }
    };

    return (
        <Container>
            <Wrapper>
                <Helmet>
                    <title>Sign Up | Black Book</title>
                </Helmet>
                <SignUpH4>Let's get started</SignUpH4>
                <SignUpForm onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("nick", {
                            required: "닉네임은 필수 입니다.",
                        })}
                        className="input"
                        type="nick"
                        placeholder="Nick"
                        required
                    />
                    {errors.nick?.message && <FormError errorMessage={errors.nick?.message} />}
                    <input
                        {...register("password", {
                            required: "비밀번호는 필수 입니다.",
                            minLength: { value: 6, message: "최소 6자 이상 입니다." },
                        })}
                        className="input"
                        type="password"
                        placeholder="Password"
                        required
                        autoComplete="off"
                    />
                    {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
                    <input
                        {...register("email", {
                            required: "이메일은 필수 입니다.",
                            pattern: {
                                // eslint-disable-next-line no-useless-escape
                                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "올바른 이메일 형식이 아닙니다.",
                            },
                        })}
                        className="input"
                        type="email"
                        placeholder="Email"
                        required
                    />
                    {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
                    <Button canClick={isValid} loading={loading} actionText={"Sign Up"} />
                    {error && <FormError errorMessage={error} />}
                </SignUpForm>
                <div>
                    계정이 있으신가요?{" "}
                    <Link role="loginLink" to="/login" className="text-black font-semibold hover:underline">
                        로그인
                    </Link>
                </div>
            </Wrapper>
        </Container>
    );
};
