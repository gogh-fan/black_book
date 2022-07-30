import { loadTossPayments } from "@tosspayments/payment-sdk";
import axios from "axios";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BACK_URL } from "../constant/constants";

export const Menu: React.FC = () => {
    const onClick = async () => {
        const response = await axios.get(`${BACK_URL}/user/me`, {
            headers: { jwt: localStorage.getItem("jwt") ?? "" },
        });
        if (!response.data.data.verified) {
            window.alert("이메일 인증을 완료해 주세요.");
            return;
        }
        const tossPayments = await loadTossPayments("test_ck_OEP59LybZ8Bdv6A1JxkV6GYo7pRe");
        tossPayments.requestPayment("카드", {
            amount: 1000,
            orderId: uuidv4(),
            orderName: "비밀멤버",
            customerName: "Black Book",
            successUrl: `${BACK_URL}/payment/success`,
            failUrl: `${BACK_URL}/payment/fail`,
        });
    };

    return (
        <div className="flex justify-around bg-black text-white">
            <Link to={"/menu/create"}>
                <span>의뢰 작성</span>
            </Link>
            <Link to={"/menu/commissions"}>
                <span>내 의뢰 보기</span>
            </Link>
            <Link to={"/menu/management"}>
                <span>내 의뢰 관리</span>
            </Link>
            <Link to={"/menu/participanted-works"}>
                <span>참가 의뢰 보기</span>
            </Link>
            <button onClick={onClick}>비밀맴버 결제</button>
        </div>
    );
};
