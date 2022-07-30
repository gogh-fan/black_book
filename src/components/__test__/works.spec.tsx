import { fireEvent, render, screen } from "@testing-library/react";
import { workStatus } from "../../types/work";
import { Works } from "../works";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Works />", () => {
    const worksProps = {
        id: "1",
        title: "title",
        description: "description",
        coverImg: null,
        state: workStatus.Recruit,
    };

    it("로그아웃 상태", () => {
        render(<Works {...worksProps} />);

        screen.getByText("Recruit");
        screen.getByText("title");
        screen.getByText("description");
        expect(screen.getByRole("img")).toHaveStyle("background-image: url(null);");

        window.alert = jest.fn();
        fireEvent.click(screen.getByRole("wrapper"));
        expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it("로그인 상태", () => {
        localStorage.setItem("jwt", "1");

        render(
            <Router>
                <Works {...worksProps} />
            </Router>
        );

        screen.getByText("Recruit");
        screen.getByText("title");
        screen.getByText("description");
        expect(screen.getByRole("a")).toHaveAttribute("href", "/work/1");
        expect(screen.getByRole("img")).toHaveStyle("background-image: url(null);");
    });
});
