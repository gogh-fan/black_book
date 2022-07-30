import tw from "tailwind-styled-components";

interface IButtonProps {
    canClick: boolean;
    loading: boolean;
    actionText: string;
}

const ButtonWrapper = tw.button`
    py-4
    text-lg
    font-medium
    text-white
    focus:outline-none
    transition-colors 
`;

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => (
    <ButtonWrapper
        role="button"
        className={`
        ${canClick ? "bg-gray-300 hover:bg-gray-600" : "bg-gray-300 pointer-events-none"}
    `}
    >
        {loading ? "Loading..." : actionText}
    </ButtonWrapper>
);
