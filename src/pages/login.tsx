import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BACK_URL } from "../constant/constants";
import tw from "tailwind-styled-components";
import { Helmet } from "react-helmet-async";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";

const Container = tw.div`
    h-screen
    flex
    items-center
    flex-col
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
const LoginH4 = tw.h4`
    w-full
    font-bold
    text-left
    text-2xl mb-5
`;
const LoginForm = tw.form`
    grid
    mt-5
    gap-3
    mb-3
    w-full
`;

interface IForm {
    email: string;
    password: string;
}

export const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IForm>({ mode: "onChange" });

    const fetchLogin = async ({ email, password }: IForm) => {
        try {
            setLoading(true);
            const response = await axios.post(`${BACK_URL}/user/login`, {
                email,
                password,
            });
            setLoading(false);
            return { token: response.data.data.token, e: null };
        } catch (error: any) {
            const e: string = error.response?.data.error?.message;
            setLoading(false);
            return { token: null, e: e ?? error.response?.data.message };
        }
    };

    const onSubmit = async () => {
        if (!loading) {
            const { email, password } = getValues();
            const { token, e } = await fetchLogin({ email, password });
            if (!e) {
                localStorage.setItem("jwt", token);
                navigate("/", { replace: true });
                window.location.reload();
            } else {
                setError(e);
            }
        }
    };

    return (
        <Container>
            <Wrapper>
                <Helmet>
                    <title>Login | Black Book</title>
                </Helmet>
                <LoginH4>Welcome</LoginH4>
                <LoginForm role="loginForm" onSubmit={handleSubmit(onSubmit)}>
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
                    {errors.email?.message && <FormError errorMessage={errors.email.message} />}
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
                    {errors.password?.message && <FormError errorMessage={errors.password.message} />}
                    <Button canClick={isValid} loading={loading} actionText={"Login"} />
                    {error && <FormError errorMessage={error} />}
                </LoginForm>
                <div>
                    계정이 없으신 가요?{" "}
                    <Link to="/signup" className="text-black font-semibold hover:underline">
                        회원가입
                    </Link>
                </div>
            </Wrapper>
        </Container>
    );
};
