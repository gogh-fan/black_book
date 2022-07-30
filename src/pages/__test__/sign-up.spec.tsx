import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { SignUp } from "../sign-up";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("<SignUp />", () => {
    const setup = () =>
        render(
            <HelmetProvider>
                <BrowserRouter>
                    <SignUp />
                </BrowserRouter>
            </HelmetProvider>
        );

    it("랜더링", async () => {
        setup();

        screen.getByText("Let's get started");
        await waitFor(() => {
            expect(document.title).toBe("Sign Up | Black Book");
        });

        screen.getByText("계정이 있으신가요?");
        await waitFor(() => {
            expect(screen.getByRole("loginLink")).toHaveAttribute("href", "/login");
        });
        screen.getByText("로그인");
    });

    it("닉네임 에러 메시지", async () => {
        setup();

        const nick = screen.getByPlaceholderText("Nick");
        userEvent.type(nick, "nick");
        userEvent.clear(nick);
        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("닉네임은 필수 입니다.");
        });
    });

    it("비밀번호 에러 메시지", async () => {
        setup();

        const password = screen.getByPlaceholderText("Password");
        userEvent.type(password, "pass");
        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("최소 6자 이상 입니다.");
        });
        userEvent.clear(password);
        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("비밀번호는 필수 입니다.");
        });
    });

    it("이메일 에러 메시지", async () => {
        setup();

        const email = screen.getByPlaceholderText("Email");
        userEvent.type(email, "email@email");
        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("올바른 이메일 형식이 아닙니다.");
        });
        userEvent.clear(email);
        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("이메일은 필수 입니다.");
        });
    });

    it("제출 에러 메시지", async () => {
        const error = { response: { data: { message: "error" } } };
        mockedAxios.post.mockRejectedValue(error);

        setup();

        const nick = screen.getByPlaceholderText("Nick");
        const password = screen.getByPlaceholderText("Password");
        const email = screen.getByPlaceholderText("Email");
        const button = screen.getByRole("button");
        userEvent.type(nick, "nick");
        userEvent.type(password, "password");
        userEvent.type(email, "email@email.com");
        userEvent.click(button);

        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("error");
        });
    });

    it("회원가입", async () => {
        setup();

        const nick = screen.getByPlaceholderText("Nick");
        const password = screen.getByPlaceholderText("Password");
        const email = screen.getByPlaceholderText("Email");
        const button = screen.getByRole("button");
        userEvent.type(nick, "nick");
        userEvent.type(password, "password");
        userEvent.type(email, "email@email.com");
        userEvent.click(button);

        window.alert = jest.fn();
        await waitFor(() => {
            expect(window.alert).toBeCalledTimes(1);
        });
        expect(window.location.pathname).toBe("/");
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
