import { useRecoilState } from "recoil";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";
import { isLoggedInState } from "./atoms";
import { useEffect } from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem("jwt")));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
