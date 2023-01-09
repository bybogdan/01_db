import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import superjson from "superjson";
import { twButton, twCenteringBlock, twInput } from "../../utils/twCommon";
import { prisma } from "../../server/db/client";
import { FunLoader, Loader } from "../../components/Loader";
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { capitalizeString } from "../../utils/common";
import Link from "next/link";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import { trpc } from "../../utils/trpc";
import { LoaderSize } from "../../types/misc";

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

  const user = await ssg.user.getUser.fetch(userId as string);

  return {
    props: {
      userId,
      recordUsedData: user
        ? {
            categories: user.categories || null,
          }
        : {},
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
  const { userId, recordUsedData } = props;

  const { categories } = recordUsedData;

  const categoriesArray =
    categories !== null ? (categories as string[]) : deafultCategories;

  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const [newCategory, setNewCategory] = useState("");

  const {
    mutate: setCategories,
    isLoading: setCategoriesIsLoading,
    isSuccess: setCategoriesIsSuccess,
  } = trpc.user.setCategories.useMutation();

  const saveNewCategory = () => {
    setCategories({
      id: userId,
      categories: [...categoriesArray, newCategory.toUpperCase().trim()],
    });
  };

  useEffect(() => {
    if (setCategoriesIsSuccess) {
      console.log("heheh");
      setNewCategory("");
    }
  }, [setCategoriesIsSuccess]);

  useEffect(() => {
    if (status !== "loading" && sessionData?.user?.id !== userId) {
      router.push("/");
    }
  }, [sessionData?.user?.id, status, userId, router]);

  if (status === "loading" || sessionData?.user?.id !== userId) {
    return (
      <div className={`${twCenteringBlock}`}>
        <FunLoader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dialga:User</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-8 p-6 text-slate-900 dark:text-white">
        <Header
          userId={(sessionData.user.id as string) || ""}
          userName={(sessionData.user.name as string) || ""}
          homePageHref="/"
        />
        <div className="flex flex-col gap-4">
          <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
            {capitalizeString("User page")}
          </h5>

          <h5 className="text-xl leading-tight text-gray-900 dark:text-white">
            {capitalizeString("Add category")}
          </h5>
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              className={`${twInput}`}
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className={twButton} onClick={saveNewCategory}>
              {!setCategoriesIsLoading ? (
                capitalizeString("Save")
              ) : (
                <Loader size={LoaderSize.SMALL} />
              )}
            </button>
          </div>

          <Link href={`/stats/${userId}`} className={twButton}>
            {capitalizeString("To stats")}
          </Link>

          <button className={twButton} onClick={() => signOut()}>
            {capitalizeString("sign out")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Stats;
