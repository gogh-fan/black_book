import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { LoggedInRouter } from "../logged-in-router";

jest.mock("../../pages/logged-in-home.tsx", () => ({ LoggedInHome: () => <span>LoggedInHome</span> }));
jest.mock("../../pages/work-by-id.tsx", () => ({ WorkById: () => <span>WorkById</span> }));
jest.mock("../../pages/edit-profile.tsx", () => ({ EditProFile: () => <span>EditProFile</span> }));
jest.mock("../../pages/create-work.tsx", () => ({ CreateWork: () => <span>CreateWork</span> }));
jest.mock("../../pages/commissions.tsx", () => ({ Commissions: () => <span>Commissions</span> }));
jest.mock("../../pages/management.tsx", () => ({ Management: () => <span>Management</span> }));
jest.mock("../../pages/edit-participant.tsx", () => ({ EditParticipant: () => <span>EditParticipant</span> }));
jest.mock("../../pages/edit-work.tsx", () => ({ EditWork: () => <span>EditWork</span> }));
jest.mock("../../pages/participated.tsx", () => ({ ParticipatedWorks: () => <span>ParticipatedWorks</span> }));
jest.mock("../../pages/payment.tsx", () => ({ Payment: () => <span>Payment</span> }));

describe("<LoggedInRouter />", () => {
    it("랜더링", () => {
        render(
            <RecoilRoot>
                <LoggedInRouter />
            </RecoilRoot>
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
