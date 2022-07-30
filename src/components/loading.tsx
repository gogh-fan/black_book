import tw from "tailwind-styled-components";

const LoadingWrapper = tw.div`
    h-screen
    flex
    justify-center
    items-center
`;
const LoadingText = tw.span`
    font-medium
    text-xl
    tracking-wide
`;

export const Loading: React.FC = () => {
    return (
        <LoadingWrapper>
            <LoadingText>Loading...</LoadingText>
        </LoadingWrapper>
    );
};
