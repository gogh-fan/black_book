import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BACK_URL } from "../constant/constants";

export const EmailVerify = () => {
    const code = useLocation().search.slice(6);
    const fetchVerifyEmail = async () => {
        await axios.get(`${BACK_URL}/user/email-verify?code=${code}`, {
            headers: { jwt: localStorage.getItem("jwt") ?? "" },
        });
    };
    useEffect(() => {
        fetchVerifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="flex justify-center items-center mt-40">인증 여부를 확인 하세요.</div>;
};
