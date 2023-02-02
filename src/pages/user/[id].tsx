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
import { useEffect } from "react";
import { capitalizeString } from "../../utils/common";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import { trpc } from "../../utils/trpc";
import type { User } from "@prisma/client";
import { UserCategories } from "../../components/UserCategories";

const deafultCategories = [
  "FOOD",
  "TRANSPORT",
  "RENT",
  "UTILITY PAYMENT",
  "SALARY",
];

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

const Stats = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { userId, user: initialData } = props;

  const categoriesArray: string[] =
    initialData.categories !== null
      ? (initialData.categories as string[])
      : deafultCategories;

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
    },
  });

  const categories = userData?.categories as string[];

  const { data: sessionData, status } = useSession();
  const router = useRouter();

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
          homePageHref="/"
        />
        <div className="flex flex-col gap-4">
          <UserCategories
            categories={categories}
            userId={userId}
            refetchGetUser={handleRefetchGetUser}
          />
          <button className={twButton} onClick={() => signOut()}>
            {capitalizeString("sign out")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Stats;
