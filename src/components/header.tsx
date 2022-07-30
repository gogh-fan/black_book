import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import tw from "tailwind-styled-components";
import { useForm } from "react-hook-form";
import logo from "../images/logo.svg";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../atoms";

const HeaderContainer = tw.header`
    px-5
    xl:px-0
    py-4
`;
const HeaderWrapper = tw.div`
    w-full
    max-w-screen-xl
    mx-auto
    flex
    justify-between
    items-center
`;
const HeaderLogo = tw.img`
    w-36
`;
const HeaderButton = tw.button`
    bg-black
    text-white
    rounded-md
    mr-4
    py-2
    px-1
`;
const SearchForm = tw.form`
    mt-2
    flex
    justify-center
    items-center
`;
const SearchInput = tw.input`
    input
    rounded-md
    border-black
`;

interface IForm {
    searchTerm: string;
}

export const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

    //Search
    const { register, handleSubmit, getValues } = useForm<IForm>();
    const navigate = useNavigate();
    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        navigate(`/search?term=${searchTerm}`);
    };

    //LogOut
    const logOutClick = () => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        navigate("/", { replace: true });
    };

    return (
        <HeaderContainer>
            <HeaderWrapper>
                <Link role="logoLink" to="/">
                    <HeaderLogo src={logo} alt="Black Book" />
                </Link>
                <Link role="titleLink" to="/">
                    <span className="text-3xl font-bold">Black Book</span>
                </Link>
                <span className="text-xs">
                    {isLoggedIn ? (
                        <>
                            <HeaderButton onClick={logOutClick}>LogOut</HeaderButton>
                            <Link role="editLink" to="/edit-profile">
                                <FontAwesomeIcon icon={faUser} className="text-xl" />
                            </Link>
                            <SearchForm role="searchForm" onSubmit={handleSubmit(onSearchSubmit)}>
                                <SearchInput
                                    {...register("searchTerm", { required: true })}
                                    type={"search"}
                                    placeholder="Search Works..."
                                />
                            </SearchForm>
                        </>
                    ) : (
                        <>
                            <Link role="loginLink" to="/login">
                                <HeaderButton>Login</HeaderButton>
                            </Link>
                            <Link role="signUpLink" to="/signup">
                                <HeaderButton>Sign Up</HeaderButton>
                            </Link>
                            <SearchForm role="search" onClick={() => alert("로그인이 필요 합니다.")}>
                                <SearchInput placeholder="Search Works..." />
                            </SearchForm>
                        </>
                    )}
                </span>
            </HeaderWrapper>
        </HeaderContainer>
    );
};
