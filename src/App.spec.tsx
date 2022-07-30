import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { RecoilRoot, RecoilState, useRecoilState } from "recoil";
import App from "./App";
import { isLoggedInState } from "./atoms";

jest.mock("./routers/logged-out-router", () => {
    return {
        LoggedOutRouter: () => <span>logged-out</span>,
    };
});
jest.mock("./routers/logged-in-router", () => {
    return {
        LoggedInRouter: () => <span>logged-in</span>,
    };
});

export const RecoilObserver = ({ atom }: { atom: RecoilState<boolean> }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(atom);
    useEffect(() => setIsLoggedIn(true));
    return null;
};

describe("<App />", () => {
    it("로그아웃 상태", () => {
        render(
            <RecoilRoot>
                <App />
            </RecoilRoot>
        );
        screen.getByText("logged-out");
    });

    it("로그인 상태", async () => {
        render(
            <RecoilRoot>
                <RecoilObserver atom={isLoggedInState} />
                <App />
            </RecoilRoot>
        );

        screen.getByText("logged-in");
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
