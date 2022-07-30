import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loading } from "../components/loading";
import { WorkAllWorks } from "../types/work";
import tw from "tailwind-styled-components";
import { Works } from "../components/works";
import { BACK_URL } from "../constant/constants";

const HomeContainer = tw.div``;
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

export const LoggedOutHome = () => {
    const [page, setPage] = useState<number>(1);
    const [allWorks, setAllWorks] = useState<WorkAllWorks>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    const fetchAllWorks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACK_URL}/work/${page}`);
            setAllWorks(response.data);
        } catch (e) {
            setError(e);
        }

        setLoading(false);
    };

    const onNextPageClick = () => {
        setPage((currentPage) => ++currentPage);
    };
    const onPrevPageClick = () => {
        setPage((currentPage) => --currentPage);
    };

    useEffect(() => {
        fetchAllWorks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    if (!allWorks || loading || error) {
        return <Loading />;
    }

    return (
        <HomeContainer>
            <Helmet>
                <title>Home | Black Book</title>
            </Helmet>
            {!loading && (
                <WorksContainer>
                    <WorksWrapper>
                        {allWorks?.data?.works.map((work) => (
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
                            Page {page} of {allWorks?.data?.totalPages}
                        </span>
                        {page !== allWorks?.data?.totalPages ? (
                            <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
                                &rarr;
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </PageWrapper>
                </WorksContainer>
            )}
        </HomeContainer>
    );
};
