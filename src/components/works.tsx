import { Link } from "react-router-dom";
import { workStatus } from "../types/work";
import tw from "tailwind-styled-components";

const WorkWrapper = tw.div`
    flex
    flex-col
    cursor-pointer
`;
const WorkCoverImg = tw.div`
    bg-gray-500
    bg-cover
    bg-center
    mb-3
    h-52
    py-5
`;
const WorkState = tw.span`
    ml-2
    bg-black
    text-white
    py-1 px-2
    rounded-md
`;
const WorkTitle = tw.h3`
    text-xl
    font-medium
`;
const WorkDescription = tw.span`
    border-t
    mt-2
    py-2
    text-xs
    opacity-50
    border-gray-400
    overflow-hidden
`;

interface IWorkProps {
    id: string;
    title: string;
    description: string;
    coverImg: string | null;
    state: workStatus;
}

export const Works: React.FC<IWorkProps> = ({ id, title, description, coverImg = null, state }) => {
    if (!localStorage.getItem("jwt"))
        return (
            <WorkWrapper role="wrapper" onClick={() => alert("로그인이 필요 합니다.")}>
                <WorkCoverImg role="img" style={{ backgroundImage: `url(${coverImg})` }}>
                    <WorkState className="">{state}</WorkState>
                </WorkCoverImg>
                <WorkTitle>{title}</WorkTitle>
                <WorkDescription>{description}</WorkDescription>
            </WorkWrapper>
        );

    return (
        <Link role="a" to={`/work/${id}`}>
            <WorkWrapper>
                <WorkCoverImg role="img" style={{ backgroundImage: `url(${coverImg})` }}>
                    <span className="ml-2 bg-black text-white py-1 px-2 rounded-md">{state}</span>
                </WorkCoverImg>
                <WorkTitle>{title}</WorkTitle>
                <WorkDescription>{description}</WorkDescription>
            </WorkWrapper>
        </Link>
    );
};
