import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoggedOutHome } from "../pages/logged-out-home";
import { NotFound } from "../pages/404";
import { SignUp } from "../pages/sign-up";
import { Header } from "../components/header";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<LoggedOutHome />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
