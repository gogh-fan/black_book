import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Header } from "../header";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import logo from "../../images/logo.svg";
import { RecoilObserver } from "../../App.spec";
import { isLoggedInState } from "../../atoms";

jest.mock("@fortawesome/react-fontawesome", () => {
    return {
        FontAwesomeIcon: () => <svg>Edit Icon</svg>,
    };
});

describe("<Header />", () => {
    it("로그아웃 상태", () => {
        render(
            <RecoilRoot>
                <Router>
                    <Header />
                </Router>
            </RecoilRoot>
        );

        screen.getByText("Black Book");
        screen.getByText("Login");
        screen.getByText("Sign Up");
        expect(screen.getByRole("logoLink")).toHaveAttribute("href", "/");
        expect(screen.getByRole("titleLink")).toHaveAttribute("href", "/");
        expect(screen.getByRole("loginLink")).toHaveAttribute("href", "/login");
        expect(screen.getByRole("signUpLink")).toHaveAttribute("href", "/signup");
        expect(screen.getByRole("img")).toHaveAttribute("src", logo);

        window.alert = jest.fn();
        fireEvent.click(screen.getByRole("search"));
        expect(window.alert).toHaveBeenCalledTimes(1);
    });

    it("로그인 상태", async () => {
        localStorage.setItem("jwt", "1");

        render(
            <RecoilRoot>
                <RecoilObserver atom={isLoggedInState} />
                <Router>
                    <Header />
                </Router>
            </RecoilRoot>
        );

        screen.getByText("Edit Icon");
        expect(screen.getByRole("editLink")).toHaveAttribute("href", "/edit-profile");

        const form = screen.getByRole("searchForm");
        const search = screen.getByPlaceholderText("Search Works...");
        fireEvent.input(search, { target: { value: "work" } });
        fireEvent.submit(form);
        await waitFor(() => {
            expect(window.location.href).toBe("http://localhost/search?term=work");
        });

        const logoutButton = screen.getByText("LogOut");
        fireEvent.click(logoutButton);
        expect(localStorage.getItem("jwt")).toBeFalsy();
        expect(window.location.pathname).toBe("/");
    });
});
