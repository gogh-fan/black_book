import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../components/header";
import { WorkById } from "../pages/work-by-id";
import { LoggedInHome } from "../pages/logged-in-home";
import { EditProFile } from "../pages/edit-profile";
import { IRoutes } from "../types/interfaces";
import { Menu } from "../components/menu";
import { Commissions } from "../pages/commissions";
import { Management } from "../pages/management";
import { Payment } from "../pages/payment";
import { NotFound } from "../pages/404";
import { EditParticipant } from "../pages/edit-participant";
import { EditWork } from "../pages/edit-work";
import { ParticipatedWorks } from "../pages/participated";
import { CreateWork } from "../pages/create-work";
import { EmailVerify } from "../pages/email-verify";

const loggedInRoutes: IRoutes[] = [
    { path: "/", element: <LoggedInHome /> },
    { path: "/work/:workId", element: <WorkById /> },
    { path: "/edit-profile", element: <EditProFile /> },
    { path: "/email-verify", element: <EmailVerify /> },
];
const menuRoutes: IRoutes[] = [
    { path: "create", element: <CreateWork /> },
    { path: "commissions", element: <Commissions /> },
    { path: "management", element: <Management /> },
    { path: "management/participant/:workId", element: <EditParticipant /> },
    { path: "management/work/:workId", element: <EditWork /> },
    { path: "participanted-works", element: <ParticipatedWorks /> },
    { path: "payment", element: <Payment /> },
];

export const LoggedInRouter = () => {
    return (
        <Router>
            <Header />
            <Menu />
            <Routes>
                {loggedInRoutes.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                ))}
                <Route path="/menu">
                    {menuRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
