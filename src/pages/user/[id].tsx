import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import superjson from "superjson";
import * as Switch from "@radix-ui/react-switch";

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
  const [isShowCurrentMonthBalanceClient, setIsShowCurrentMonthBalanceClient] =
    useState(false);
  const [isShowFullBalanceClient, setIsShowFullBalanceClient] = useState(false);
  const [isShowLast30DaysBalanceClient, setIsShowLast30DaysBalanceClient] =
    useState(false);
  const [isAddTypeToHomeCategoryClient, setAddTypeToHomeCategoryClient] =
    useState(false);

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
  const homePageCategory = userData?.homePageCategory as string;
  const tags = (userData?.tags as string[]) || tagsArray;
  const currencies = userData?.currencies as string[];
  const isAddTypeToHomeCategory = userData?.isAddTypeToHomeCategory as boolean;

  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const {
    mutate: setIsShowCurrentMonthBalance,
    isLoading: isLoadingShowCurrentMonthBalance,
  } = trpc.user.setIsShowCurrentMonthBalance.useMutation({
    onSuccess: async () => {
      await refetchGetUser();
    },
  });

  const {
    mutate: setIsShowFullBalance,
    isLoading: isLoadingIsShowFullBalance,
  } = trpc.user.setIsShowFullBalance.useMutation({
    onSuccess: async () => {
      await refetchGetUser();
    },
  });

  const {
    mutate: setIsShowLast30DaysBalance,
    isLoading: isLoadingIsShowLast30DaysBalanceClient,
  } = trpc.user.setIsShowLast30DaysBalance.useMutation({
    onSuccess: async () => {
      await refetchGetUser();
    },
  });

  const {
    mutate: setAddTypeToHomeCategory,
    isLoading: isLoadingAddTypeToHomeCategory,
  } = trpc.user.setAddTypeToHomeCategory.useMutation({
    onSuccess: async () => {
      await refetchGetUser();
    },
  });

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
    if (userData?.isShowCurrentMonthBalance) {
      setIsShowCurrentMonthBalanceClient(true);
    }
    if (userData?.isShowFullBalance) {
      setIsShowFullBalanceClient(true);
    }
    if (userData?.isShowLast30DaysBalance) {
      setIsShowLast30DaysBalanceClient(true);
    }
  }, [
    userData?.isShowCurrentMonthBalance,
    userData?.isShowFullBalance,
    userData?.isShowLast30DaysBalance,
  ]);

  useEffect(() => {
    if (userData?.isAddTypeToHomeCategory) {
      setAddTypeToHomeCategoryClient(true);
    }
  }, [userData?.isAddTypeToHomeCategory]);

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

  const handleSwitchChange = (checked: boolean) => {
    setIsShowCurrentMonthBalanceClient(checked);
    setIsShowCurrentMonthBalance({
      id: userId,
      isShowCurrentMonthBalance: checked,
    });
    addQueryParamToRefetchDataOnHomePage();
  };

  const handleAddTypeToHomeCategory = (checked: boolean) => {
    setAddTypeToHomeCategoryClient(checked);
    setAddTypeToHomeCategory({
      id: userId,
      isAddTypeToHomeCategory: checked,
    });
    addQueryParamToRefetchDataOnHomePage();
  };

  return (
    <>
      <Head>
        <title>Plutus:User</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-14 p-6 text-slate-900 dark:text-white">
        <Header
          userId={(sessionData.user.id as string) || ""}
          userName={(sessionData.user.name as string) || ""}
          homePageHref={homePageHref}
        />

        <div className="flex w-full max-w-5xl flex-col gap-8 self-center">
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
            homePageCategory={homePageCategory}
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

          <hr />

          <h5 className="text-center text-xl font-semibold leading-tight text-gray-900 dark:text-white">
            Home page balance settings
          </h5>

          <div className="flex items-center gap-6">
            <Switch.Root
              className="relative h-[30px] w-[46px] cursor-pointer rounded-full border-2 border-solid border-blue-600 outline-none data-[state=checked]:bg-blue-600"
              id="balance-type-switch"
              onCheckedChange={(checked) => {
                setIsShowCurrentMonthBalanceClient(checked);

                setIsShowCurrentMonthBalance({
                  id: userId,
                  isShowCurrentMonthBalance: checked,
                });

                if (checked) {
                  setIsShowFullBalanceClient(false);

                  setIsShowFullBalance({
                    id: userId,
                    isShowFullBalance: false,
                  });

                  setIsShowLast30DaysBalanceClient(false);

                  setIsShowLast30DaysBalance({
                    id: userId,
                    isShowLast30DaysBalance: false,
                  });
                }
                addQueryParamToRefetchDataOnHomePage();
              }}
              checked={isShowCurrentMonthBalanceClient}
            >
              <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label
              className="max-w-[50%] cursor-pointer break-words text-xl font-medium leading-tight text-gray-900 dark:text-white"
              htmlFor="balance-type-switch"
            >
              Show current month balance
            </label>
            {isLoadingShowCurrentMonthBalance ? <Loader /> : null}
          </div>
          <div className="flex items-center gap-6">
            <Switch.Root
              className="relative h-[30px] w-[46px] cursor-pointer rounded-full border-2 border-solid border-blue-600 outline-none data-[state=checked]:bg-blue-600"
              id="balance-type-switch"
              onCheckedChange={(checked) => {
                setIsShowLast30DaysBalanceClient(checked);

                setIsShowLast30DaysBalance({
                  id: userId,
                  isShowLast30DaysBalance: checked,
                });

                if (checked) {
                  setIsShowFullBalanceClient(false);

                  setIsShowFullBalance({
                    id: userId,
                    isShowFullBalance: false,
                  });

                  setIsShowCurrentMonthBalanceClient(false);

                  setIsShowCurrentMonthBalance({
                    id: userId,
                    isShowCurrentMonthBalance: false,
                  });
                }
                addQueryParamToRefetchDataOnHomePage();
              }}
              checked={isShowLast30DaysBalanceClient}
            >
              <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label
              className="max-w-[50%] cursor-pointer break-words text-xl font-medium leading-tight text-gray-900 dark:text-white"
              htmlFor="balance-type-switch"
            >
              Show last 30 days balance
            </label>
            {isLoadingShowCurrentMonthBalance ? <Loader /> : null}
          </div>
          <div className="flex items-center gap-6">
            <Switch.Root
              className="relative h-[30px] w-[46px] cursor-pointer rounded-full border-2 border-solid border-blue-600 outline-none data-[state=checked]:bg-blue-600"
              id="balance-type-switch"
              onCheckedChange={(checked) => {
                setIsShowFullBalanceClient(checked);

                setIsShowFullBalance({
                  id: userId,
                  isShowFullBalance: checked,
                });

                if (checked) {
                  setIsShowLast30DaysBalanceClient(false);

                  setIsShowLast30DaysBalance({
                    id: userId,
                    isShowLast30DaysBalance: false,
                  });

                  setIsShowCurrentMonthBalanceClient(false);

                  setIsShowCurrentMonthBalance({
                    id: userId,
                    isShowCurrentMonthBalance: false,
                  });
                }
                addQueryParamToRefetchDataOnHomePage();
              }}
              checked={isShowFullBalanceClient}
            >
              <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label
              className="max-w-[50%] cursor-pointer break-words text-xl font-medium leading-tight text-gray-900 dark:text-white"
              htmlFor="balance-type-switch"
            >
              Show all time balance
            </label>
            {isLoadingShowCurrentMonthBalance ? <Loader /> : null}
          </div>

          <hr />

          <div className="flex items-center gap-6">
            <Switch.Root
              className="relative h-[30px] w-[46px] cursor-pointer rounded-full border-2 border-solid border-blue-600 outline-none data-[state=checked]:bg-blue-600"
              id="balance-type-switch"
              onCheckedChange={handleAddTypeToHomeCategory}
              checked={isAddTypeToHomeCategoryClient}
            >
              <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
            <label
              className="max-w-[50%] cursor-pointer break-words text-xl font-medium leading-tight text-gray-900 dark:text-white"
              htmlFor="balance-type-switch"
            >
              Use normal types for home page category
            </label>
            {isLoadingAddTypeToHomeCategory ? <Loader /> : null}
          </div>

          <button className={twButton} onClick={() => signOut()}>
            {capitalizeString("sign out")}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPage;
