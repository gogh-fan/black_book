import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { LoggedOutRouter } from "../logged-out-router";

jest.mock("../../pages/logged-out-home", () => ({ LoggedOutHome: () => <span>LoggedOutHome</span> }));
jest.mock("../../pages/sign-up.tsx", () => ({ SignUp: () => <span>SignUp</span> }));
jest.mock("../../pages/login.tsx", () => ({ Login: () => <span>Login</span> }));
jest.mock("../../pages/404.tsx", () => ({ NotFound: () => <span>NotFound</span> }));

describe("<LoggedOutRouter>", () => {
    it("랜더링", () => {
        render(
            <RecoilRoot>
                <LoggedOutRouter />
            </RecoilRoot>
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
