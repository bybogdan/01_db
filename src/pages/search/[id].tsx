import { useState } from "react";
import Head from "next/head";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import superjson from "superjson";
import Select from "react-select";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { Header } from "../../components/Header";
import { createContext } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import {
  defaultTags,
  preapreDataForSelect,
  voidFunction,
} from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { StatsCategory } from "../../components/StatsCategory";
import { Loader } from "../../components/Loader";
import { LoaderSize } from "../../types/misc";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const userId = context.params?.id as string;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const userData = await ssg.user.getUser.fetch(userId);

  return {
    props: {
      defaultUserData: userData,
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

const SearchPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { defaultUserData } = props;

  const homePageHref = "/";

  const { data: userData } = trpc.user.getUser.useQuery(
    defaultUserData?.id as string,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      initialData: defaultUserData,
    }
  );

  const tagsArray = (userData?.tags as string[]) ?? defaultTags;
  const tagsOptions = preapreDataForSelect(tagsArray);

  const [searchData, setSearchData] = useState({
    tag: "",
  });

  const { tag: currentTag } = searchData;

  const { data, isFetching } = trpc.record.getRecordsBySearch.useQuery(
    { userId: userData?.id as string, data: { tag: currentTag } },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      initialData: {
        records: [],
        sum: 0,
      },
    }
  );

  const { records, sum } = data!;

  const isLoading = isFetching;

  return (
    <>
      <Head>
        <title>Plutus:Search</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="align-between flex min-h-screen flex-col justify-between gap-1 p-6 text-slate-900 dark:text-white">
        <div className="flex flex-col gap-10">
          <Header
            userName={userData?.name as string}
            userId={userData?.id as string}
            homePageHref={homePageHref}
          />

          <div className="flex flex-col gap-8">
            {tagsOptions.length ? (
              <Select
                placeholder="Select tags"
                className="my-react-select-container"
                classNamePrefix="my-react-select"
                options={tagsOptions}
                value={tagsOptions.find((c) => currentTag === c.value)}
                onChange={(val) => setSearchData({ tag: val?.value ?? "" })}
              />
            ) : null}

            {records?.length ? (
              <>
                <StatsCategory
                  category={currentTag}
                  data={{
                    records,
                    income: sum,
                    expense: sum,
                  }}
                  handleCheckScroll={voidFunction}
                />
              </>
            ) : null}

            {!records?.length && currentTag && !isFetching ? (
              <h4 className="text-3xl ">No records</h4>
            ) : null}

            {isLoading && currentTag ? <Loader size={LoaderSize.BASE} /> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
