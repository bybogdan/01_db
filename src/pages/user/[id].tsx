import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import superjson from "superjson";

import { twButton, twCenteringBlock } from "../../utils/twCommon";
import { prisma } from "../../server/db/client";
import { Loader } from "../../components/Loader";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { useCallback, useEffect, useState } from "react";
import {
  capitalizeString,
  defaultCategories,
  defaultTags,
} from "../../utils/common";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import { trpc } from "../../utils/trpc";
import type { User } from "@prisma/client";
import { UserCategories } from "../../components/UserCategories";
import Link from "next/link";
import { InstallIcon } from "../../components/icons";
import { UserCurrencies } from "../../components/UserCurrencies";
import { UserTags } from "../../components/UserTags";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const userId = context.params?.id as string;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const user = (await ssg.user.getUser.fetch(userId as string)) as User;

  return {
    props: {
      userId,
      user,
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

const UserPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { userId, user: initialData } = props;

  const [homePageHref, setHomePageHref] = useState("/");
  const [isHighlitedTags, setIsHighlitedTags] = useState(false);

  const categoriesArray: string[] =
    initialData.categories !== null
      ? (initialData.categories as string[])
      : defaultCategories;

  const tagsArray: string[] =
    initialData.tags !== null ? (initialData.tags as string[]) : defaultTags;

  const {
    data: userData,
    refetch: refetchGetUser,
    isLoading: isLoadingGetUser,
  } = trpc.user.getUser.useQuery(userId as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    initialData: {
      ...initialData,
      categories: categoriesArray,
      tags: tagsArray,
    },
  });

  const categories = (userData?.categories as string[]) || categoriesArray;
  const tags = (userData?.tags as string[]) || tagsArray;
  const currencies = userData?.currencies as string[];

  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const addQueryParamToRefetchDataOnHomePage = useCallback(() => {
    setHomePageHref("/?update=1");
  }, []);

  useEffect(() => {
    const { addTags } = router.query;
    if (addTags) {
      setIsHighlitedTags(true);
    }
    router.replace(`/user/${userId}`, undefined, { shallow: true });
  }, []);

  useEffect(() => {
    if (status !== "loading" && sessionData?.user?.id !== userId) {
      router.push("/");
    }
  }, [sessionData?.user?.id, status, userId, router]);

  if (
    status === "loading" ||
    sessionData?.user?.id !== userId ||
    isLoadingGetUser
  ) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  const handleRefetchGetUser = async () => {
    await refetchGetUser();
  };

  return (
    <>
      <Head>
        <title>Dialga:User</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-12 p-6 text-slate-900 dark:text-white">
        <Header
          userId={(sessionData.user.id as string) || ""}
          userName={(sessionData.user.name as string) || ""}
          homePageHref={homePageHref}
        />

        <div className="flex flex-col gap-8">
          <button className={twButton}>
            <Link
              href={`/install`}
              className="flex w-full items-center justify-center gap-2"
            >
              <InstallIcon /> How to install
            </Link>
          </button>
          <UserCategories
            categories={categories}
            userId={userId}
            refetchGetUser={handleRefetchGetUser}
            addQueryParamToRefetchDataOnHomePage={
              addQueryParamToRefetchDataOnHomePage
            }
          />

          <UserTags
            tags={tags}
            userId={userId}
            refetchGetUser={handleRefetchGetUser}
            addQueryParamToRefetchDataOnHomePage={
              addQueryParamToRefetchDataOnHomePage
            }
            isHighlited={isHighlitedTags}
            setIsHighlited={setIsHighlitedTags}
          />

          <UserCurrencies
            currencies={currencies}
            userId={userId}
            refetchGetUser={handleRefetchGetUser}
            addQueryParamToRefetchDataOnHomePage={
              addQueryParamToRefetchDataOnHomePage
            }
          />

          <button className={twButton} onClick={() => signOut()}>
            {capitalizeString("sign out")}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPage;
