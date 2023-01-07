import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { twButton, twCenteringBlock } from "../../utils/twCommon";
import { FunLoader } from "../../components/Loader";
import { prisma } from "../../server/db/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { StatsMonth } from "../../components/StatsMonth";
import { BaseHeader } from "../../components/BaseHeader";
import { trpc } from "../../utils/trpc";
import Link from "next/link";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const userId = context.params?.id as string;

  return {
    props: {
      userId,
    },
    revalidate: 1,
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
  const { userId } = props;

  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const { data: recordsDataByMonths, isLoading: dataIsLoading } =
    trpc.record.getStats.useQuery(userId as string, {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (status !== "loading" && sessionData?.user?.id !== userId) {
      router.push("/");
    }
  }, [sessionData?.user?.id, status, userId, router]);

  if (
    status === "loading" ||
    sessionData?.user?.id !== userId ||
    dataIsLoading
  ) {
    return (
      <div className={`${twCenteringBlock}`}>
        <FunLoader />
      </div>
    );
  }

  if (!recordsDataByMonths) {
    return (
      <div className={`${twCenteringBlock}`}>
        <div className="flex flex-col gap-2">
          <div>Stats was not found</div>
          <Link className={twButton} href="/">
            back
          </Link>
        </div>
      </div>
    );
  }

  const getIsLastItem = (index: number) =>
    Object.keys(recordsDataByMonths).length === index + 1;

  return (
    <>
      <Head>
        <title>Dialga:Stats</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-8 p-6 text-slate-900 dark:text-white">
        <BaseHeader
          userName={(sessionData.user.name as string) || ""}
          homePageHref="/"
        />
        <div>
          {Object.entries(recordsDataByMonths).map(
            (recordDataByMonth, index) => (
              <div key={`stats-month-${index}`}>
                <StatsMonth data={recordDataByMonth} />
                {!getIsLastItem(index) ? (
                  <hr className="my-6 border-gray-300" />
                ) : null}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Stats;
