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
import type { User } from "@prisma/client";

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

  const [newCategory, setNewCategory] = useState("");
  const [showCategoryLoader, setShowCategoryLoader] = useState(false);

  const { mutate: setCategories, isSuccess: setCategoriesIsSuccess } =
    trpc.user.setCategories.useMutation();

  const saveNewCategory = async () => {
    setShowCategoryLoader(true);
    setCategories({
      id: userId,
      categories: [...categories, newCategory.toUpperCase().trim()],
    });
  };

  const deleteCategory = async (index: number) => {
    categories.splice(index, 1);
    setCategories({
      id: userId,
      categories: categories,
    });
  };

  useEffect(() => {
    (async () => {
      if (setCategoriesIsSuccess) {
        await refetchGetUser();
        setNewCategory("");
        setShowCategoryLoader(false);
      }
    })();
  }, [setCategoriesIsSuccess, refetchGetUser]);

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
            {capitalizeString("Categories")}
          </h5>
          <ul className="flex flex-col gap-6">
            {categories ? (
              categories.map((category, index) => (
                <li
                  className="flex justify-between gap-2"
                  key={`category-${index}`}
                >
                  <p>{category as string}</p>
                  <button onClick={() => deleteCategory(index)}>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path
                        fill="currentColor"
                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                      />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              <li>
                <Loader />
              </li>
            )}
            <li>
              <form
                className="flex gap-2"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                  e.preventDefault()
                }
              >
                <input
                  type="text"
                  autoComplete="off"
                  className={`${twInput}`}
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  className={twButton}
                  onClick={saveNewCategory}
                  disabled={!newCategory.trim().length}
                >
                  {!showCategoryLoader ? (
                    capitalizeString("Save")
                  ) : (
                    <Loader size={LoaderSize.SMALL} />
                  )}
                </button>
              </form>
            </li>
          </ul>

          <button className={twButton} onClick={() => signOut()}>
            {capitalizeString("sign out")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Stats;
