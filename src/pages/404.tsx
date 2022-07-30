import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";

const NotFoundWrapper = tw.div`
    h-screen
    flex
    flex-col
    items-center
    justify-center
`;
const NotFoundH2 = tw.h2`
    font-bold
    text-2xl
    mb-3
`;
const NotFoundH4 = tw.h4`
    font-medium
    text-base
    mb-5
`;

export const NotFound = () => (
    <NotFoundWrapper>
        <Helmet>
            <title>Not Found | Black Book</title>
        </Helmet>
        <NotFoundH2>Page Not Found.</NotFoundH2>
        <NotFoundH4>The page you're looking for does not exist or has moved.</NotFoundH4>
        <Link to="/" className="hover:underline text-gray-600">
            Go back home &rarr;
        </Link>
    </NotFoundWrapper>
);
