describe("logged-out-home", () => {
    it("타이틀", () => {
        cy.visit("/").title().should("eq", "Home | Black Book");
    });
});

describe("sign-up", () => {
    it("타이틀", () => {
        cy.visit("/signup").title().should("eq", "Sign Up | Black Book");
    });
    it("에러 메시지", () => {
        cy.visit("/signup");

        cy.findByPlaceholderText("Nick").type("test");
        cy.findByPlaceholderText("Nick").clear();
        cy.findByRole("alert").should("have.text", "닉네임은 필수 입니다.");
        cy.findByPlaceholderText("Nick").type("asdf");

        cy.findByPlaceholderText("Password").type("test");
        cy.findByRole("alert").should("have.text", "최소 6자 이상 입니다.");
        cy.findByPlaceholderText("Password").clear();
        cy.findByRole("alert").should("have.text", "비밀번호는 필수 입니다.");
        cy.findByPlaceholderText("Password").type("testtest");

        cy.findByPlaceholderText("Email").type("test@test");
        cy.findByRole("alert").should("have.text", "올바른 이메일 형식이 아닙니다.");
        cy.findByPlaceholderText("Email").clear();
        cy.findByRole("alert").should("have.text", "이메일은 필수 입니다.");
        cy.findByPlaceholderText("Email").type("test@test.com");

        cy.get(".grid > .py-4").should("not.have.class", "pointer-events-none").click();
        cy.findByRole("alert").should("have.text", "닉네임이 중복 됩니다.");

        cy.findByPlaceholderText("Nick").clear();
        cy.findByPlaceholderText("Nick").type("test");
        cy.findByPlaceholderText("Email").clear();
        cy.findByPlaceholderText("Email").type("asdf@asdf.com");
        cy.get(".grid > .py-4").should("not.have.class", "pointer-events-none").click();
        cy.findByRole("alert").should("have.text", "이메일이 중복 됩니다.");
    });
    it("회원가입", () => {
        cy.visit("/signup");
        cy.findByPlaceholderText("Nick").type("test");
        cy.findByPlaceholderText("Password").type("testtest");
        cy.findByPlaceholderText("Email").type("test@test.com");
        cy.get(".grid > .py-4").should("not.have.class", "pointer-events-none").click();
    });
});

describe("login", () => {
    it("타이틀", () => {
        cy.visit("/login").title().should("eq", "Login | Black Book");
    });
    it("에러 메시지", () => {
        cy.visit("/login");

        cy.findByPlaceholderText("Email").type("test@test");
        cy.findByRole("alert").should("have.text", "올바른 이메일 형식이 아닙니다.");
        cy.findByPlaceholderText("Email").clear();
        cy.findByRole("alert").should("have.text", "이메일은 필수 입니다.");

        cy.findByPlaceholderText("Email").type("tset@test.com");

        cy.findByPlaceholderText("Password").type("test");
        cy.findByRole("alert").should("have.text", "최소 6자 이상 입니다.");
        cy.findByPlaceholderText("Password").clear();
        cy.findByRole("alert").should("have.text", "비밀번호는 필수 입니다.");
        cy.findByPlaceholderText("Password").type("testtest");

        cy.get(".grid > .py-4").should("not.have.class", "pointer-events-none").click();
        cy.findByRole("alert").should("have.text", "존재하지 않는 사용자 입니다.");

        cy.findByPlaceholderText("Email").clear();
        cy.findByPlaceholderText("Email").type("test@test.com");
        cy.findByPlaceholderText("Password").clear();
        cy.findByPlaceholderText("Password").type("tsettset");
        cy.findByRole("alert").should("have.text", "존재하지 않는 사용자 입니다.");
    });
    it("로그인", () => {
        cy.visit("/login");
        cy.findByPlaceholderText("Email").type("test@test.com");
        cy.findByPlaceholderText("Password").type("testtest");
        cy.get(".grid > .py-4").should("not.have.class", "pointer-events-none").click();
        cy.window().its("localStorage.jwt").should("be.a", "string");
        cy.window().its("location.pathname").should("eq", "/");
        //회원탈퇴 - prompt 수동입력
        cy.visit("/edit-profile");
        cy.get('[role="userDeleteButton"]').click();
        cy.on("window:confirm", (text) => {
            expect(text).to.contains("회원 탈퇴 하시겠습니까?");
            return true;
        });
    });
});
