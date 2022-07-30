import { render, screen } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
    it("에러 메시지", () => {
        render(<FormError errorMessage="test" />);
        screen.getByText("test");
    });
});
