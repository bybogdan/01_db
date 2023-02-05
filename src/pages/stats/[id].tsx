import Head from "next/head";
import { useSession } from "next-auth/react";
import { twButton, twCenteringBlock } from "../../utils/twCommon";
import { Loader } from "../../components/Loader";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { StatsMonth } from "../../components/StatsMonth";
import { Header } from "../../components/Header";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { capitalizeString } from "../../utils/common";

const Stats = () => {
  const router = useRouter();
  const userId = router.query.id;

  const { data: sessionData, status } = useSession();
  const statsNodeRef = useRef(null);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [showPrevBtn, setShowPrevBtn] = useState(false);

  const {
    data: recordsDataByMonths,
    isLoading: dataIsLoading,
    isFetching: dataIsFetching,
  } = trpc.record.getStats.useQuery(userId as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const showNext = () => {
    const statsNode = statsNodeRef.current
      ? (statsNodeRef.current as HTMLDivElement)
      : null;
    if (!recordsDataByMonths || !statsNode) {
      return;
    }

    const step = statsNode.getBoundingClientRect().width;

    if (
      statsNode.scrollLeft + step >=
      step * (Object.keys(recordsDataByMonths).length - 1)
    ) {
      setShowNextBtn(false);
    }

    if (statsNode.scrollLeft + step > 0) {
      setShowPrevBtn(true);
    }

    statsNode.scrollLeft += step;
  };

  const showPrev = () => {
    const statsNode = statsNodeRef.current
      ? (statsNodeRef.current as HTMLDivElement)
      : null;
    if (!recordsDataByMonths || !statsNode) {
      return;
    }

    const step = statsNode.getBoundingClientRect().width;

    if (statsNode.scrollLeft - step <= 0) {
      setShowPrevBtn(false);
    }

    if (
      statsNode.scrollLeft - step <
      step * (Object.keys(recordsDataByMonths).length - 1)
    ) {
      setShowNextBtn(true);
    }

    statsNode.scrollLeft -= step;
  };

  useEffect(() => {
    if (status !== "loading" && sessionData?.user?.id !== userId) {
      router.push("/");
    }
  }, [sessionData?.user?.id, status, userId, router]);

  if (
    status === "loading" ||
    !sessionData?.user ||
    sessionData?.user?.id !== userId ||
    dataIsLoading ||
    dataIsFetching
  ) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  if (!recordsDataByMonths) {
    return (
      <div className={`${twCenteringBlock}`}>
        <div className="flex flex-col gap-2">
          <div>Stats was not found</div>
          <Link className={twButton} href="/">
            {capitalizeString("back to home")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dialga:Stats</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
        <Header
          userName={(sessionData.user.name as string) || ""}
          userId={(sessionData.user.id as string) || ""}
          homePageHref="/"
        />
        <div className="relative">
          <div className="relative flex overflow-hidden" ref={statsNodeRef}>
            {Object.entries(recordsDataByMonths).map(
              (recordDataByMonth, index) => (
                <StatsMonth
                  key={`stats-month-${index}`}
                  data={recordDataByMonth}
                />
              )
            )}
          </div>

          {showPrevBtn ? (
            <button onClick={showPrev} className="absolute top-0 left-0">
              <svg
                aria-hidden="true"
                focusable="false"
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                />
              </svg>
            </button>
          ) : null}

          {showNextBtn ? (
            <button onClick={showNext} className="absolute top-0 right-0">
              <svg
                aria-hidden="true"
                focusable="false"
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Stats;
