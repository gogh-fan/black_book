import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
    it("활성화 상태", () => {
        render(<Button canClick={true} loading={false} actionText={"test"} />);
        screen.getByText("test");
    });

    it("로딩 상태", () => {
        render(<Button canClick={false} loading={true} actionText={"test"} />);
        expect(screen.getByRole("button")).toHaveClass("pointer-events-none");
        screen.getByText("Loading...");
    });
});
