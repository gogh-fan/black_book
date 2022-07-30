import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Login } from "../login";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("<Login />", () => {
    const setup = () =>
        render(
            <HelmetProvider>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </HelmetProvider>
        );

    it("랜더링", async () => {
        setup();
        screen.getByText("Welcome");
        await waitFor(() => {
            expect(document.title).toBe("Login | Black Book");
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

    it("제출 에러 메시지", async () => {
        const error = { response: { data: { message: "error" } } };
        mockedAxios.post.mockRejectedValue(error);

        setup();

        const email = screen.getByPlaceholderText("Email");
        const password = screen.getByPlaceholderText("Password");
        const button = screen.getByRole("button");

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            userEvent.type(email, "email@email.com");
            userEvent.type(password, "password");
            userEvent.click(button);
        });

        await waitFor(() => {
            const errorMessage = screen.getByRole("alert");
            expect(errorMessage.textContent).toBe("error");
        });
    });

    it("로그인", async () => {
        Object.defineProperty(window, "location", {
            writable: true,
            value: { reload: jest.fn(), pathname: window.location.pathname },
        });
        const response = { data: { data: { token: "token" } } };
        mockedAxios.post.mockResolvedValue(response);

        setup();

        const email = screen.getByPlaceholderText("Email");
        const password = screen.getByPlaceholderText("Password");
        const button = screen.getByRole("button");

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await act(async () => {
            userEvent.type(email, "email@email.com");
            userEvent.type(password, "password");
            userEvent.click(button);
        });

        expect(localStorage.getItem("jwt")).toBe("token");
        expect(window.location.pathname).toBe("/");
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
