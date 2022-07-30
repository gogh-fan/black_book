import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Loading } from "../components/loading";
import { BACK_URL } from "../constant/constants";
import tw from "tailwind-styled-components";
import { Helmet } from "react-helmet-async";
import { WorkAllWorks, WorkEntity } from "../types/work";
import { Works } from "../components/works";

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

export const Commissions = () => {
    const [page, setPage] = useState<number>(1);

    const fetchMyWorks = async (page = 1) => {
        try {
            const response = await axios.get(`${BACK_URL}/work/my/${page}`, { headers: { jwt } });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    };
    const {
        data: myWorks,
        isLoading,
        refetch,
    } = useQuery<WorkAllWorks>("myWorks", () => fetchMyWorks(page), {
        refetchOnWindowFocus: false,
        retry: 0,
    });

    const onNextPageClick = () => {
        setPage((currentPage) => ++currentPage);
    };
    const onPrevPageClick = () => {
        setPage((currentPage) => --currentPage);
    };

    useEffect(() => {
        refetch();
    }, [refetch, page]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container>
            <Helmet>
                <title>My Commision | Black Book</title>
            </Helmet>
            {!isLoading && (
                <WorksContainer>
                    <WorksWrapper>
                        {myWorks?.data.works.map((work: WorkEntity) => (
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
                            Page {page} of {myWorks?.data.totalPages}
                        </span>
                        {page !== myWorks?.data.totalPages ? (
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
