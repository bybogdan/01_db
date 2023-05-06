import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  twButton,
  twCenteringBlock,
  twMinWidthButton,
} from "../../utils/twCommon";
import { Loader } from "../../components/Loader";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { StatsMonth } from "../../components/StatsMonth";
import { Header } from "../../components/Header";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { prisma } from "../../server/db/client";
import { capitalizeString } from "../../utils/common";
import { ArrowLeftIcon, ArrowRightIcon } from "../../components/icons";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { LoaderWithHeader } from "../../components/LoaderWIthHeader";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const userId = context.params?.id as string;

  return {
    props: {
      userId,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: users.map((user) => ({
      params: {
        id: user.id,
      },
    })),
    fallback: "blocking",
  };
};

const Stats = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const userId = props.userId;

  const { data: sessionData, status } = useSession();
  const statsNodeRef = useRef<HTMLDivElement>(null);
  const [showNextBtn, setShowNextBtn] = useState(true);
  const [showPrevBtn, setShowPrevBtn] = useState(false);

  const { data: recordsDataByMonths, isFetching: dataIsFetching } =
    trpc.record.getStats.useQuery(userId as string, {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const showNext = () => {
    const statsNode = statsNodeRef.current ? statsNodeRef.current : null;
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
    const statsNode = statsNodeRef.current ? statsNodeRef.current : null;
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
    sessionData?.user?.id !== userId
  ) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  if (
    sessionData?.user?.id &&
    sessionData?.user?.id === userId &&
    dataIsFetching
  ) {
    return (
      <LoaderWithHeader
        userName={(sessionData.user.name as string) ?? ""}
        userId={sessionData.user.id}
      />
    );
  }

  if (!recordsDataByMonths) {
    return (
      <div className="align-between flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
        <Header
          userName={(sessionData.user.name as string) || ""}
          userId={(sessionData.user.id as string) || ""}
          homePageHref="/"
        />
        <div className={`${twCenteringBlock} -mt-20`}>
          <div className="flex flex-col gap-2">
            <div>Stats was not found</div>
            <Link className={twButton} href="/">
              {capitalizeString("back to home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const amountOfMonths = Object.keys(recordsDataByMonths).length;

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
        {amountOfMonths ? (
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
              <button onClick={showPrev} className="absolute -top-[3px] left-0">
                <ArrowLeftIcon />
              </button>
            ) : null}

            {showNextBtn && amountOfMonths > 1 ? (
              <button
                onClick={showNext}
                className="absolute -top-[3px] right-0"
              >
                <ArrowRightIcon />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="-mt-10 flex grow flex-col items-center justify-center gap-3">
            <h4 className="text-3xl font-bold">No records yet</h4>
            <Link href="/">
              <button className={twMinWidthButton}>create the first</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Stats;
