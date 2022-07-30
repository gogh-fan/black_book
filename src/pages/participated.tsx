import axios from "axios";
import { useQuery } from "react-query";
import { Works } from "../components/works";
import { BACK_URL } from "../constant/constants";
import { WorkAllWorks, WorkEntity } from "../types/work";
import tw from "tailwind-styled-components";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loading } from "../components/loading";

const Container = tw.div``;
const WorksContainer = tw.div`
    max-w-screen-xl
    mx-auto
    mt-8
    pb-20
`;
const WorksWrapper = tw.div`
    mt-16
    grid
    md:grid-cols-3
    gap-x-5
    gap-y-8
`;
const PageWrapper = tw.div`
    mt-10
    mx-auto
    grid
    grid-cols-3
    text-center
    max-w-xs
    justify-center
    items-center
`;

const jwt = localStorage.getItem("jwt") ?? "";

export const ParticipatedWorks = () => {
    const [page, setPage] = useState<number>(1);
    const onNextPageClick = () => {
        setPage((currentPage) => ++currentPage);
    };
    const onPrevPageClick = () => {
        setPage((currentPage) => --currentPage);
    };

    const fetchParticipantedWorks = async (page = 1) => {
        try {
            const response = await axios.get(`${BACK_URL}/work/my/participated-work/${page}`, { headers: { jwt } });
            return response.data;
        } catch (e: any) {
            throw new Error(e.response.data.error.message);
        }
    };
    const { data, isLoading, refetch } = useQuery<WorkAllWorks>(
        "participantedWorks",
        () => fetchParticipantedWorks(page),
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    useEffect(() => {
        refetch();
    }, [refetch, page]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container>
            <Helmet>
                <title>My Participated | Black Book</title>
            </Helmet>
            {!isLoading && (
                <WorksContainer>
                    <WorksWrapper>
                        {data?.data.works.map((work: WorkEntity) => (
                            <Works
                                key={work.id}
                                id={work.id + ""}
                                title={work.title}
                                description={work.description}
                                coverImg={work.coverImg ?? null}
                                state={work.state}
                            />
                        ))}
                    </WorksWrapper>
                    <PageWrapper>
                        {page > 1 ? (
                            <button onClick={onPrevPageClick} className="focus:outline-none font-medium text-2xl">
                                &larr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <span>
                            Page {page} of {data?.data.totalPages}
                        </span>
                        {page !== data?.data.totalPages ? (
                            <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
                                &rarr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </PageWrapper>
                </WorksContainer>
            )}
        </Container>
    );
};
