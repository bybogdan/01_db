import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { Loader } from "../../components/Loader";
import { RecordForm } from "../../components/RecordForm";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twHeading, twButton, twCenteringBlock } from "../../utils/twCommon";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { useSession } from "next-auth/react";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const id = context.params?.id as string;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const record = await ssg.record.getRecord.fetch(id as string);
  const user = record
    ? await ssg.user.getUser.fetch(record.userId as string)
    : null;

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
      record: (record && superjson.serialize(record).json) || null,
      recordUsedData: user
        ? {
            userName: user.name,
            userId: user.id,
          }
        : {},
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const records = await prisma.record.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: records.map((record) => ({
      params: {
        id: record.id,
      },
    })),
    fallback: "blocking",
  };
};

const RecordPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id, record: initialRecord, recordUsedData } = props;

  const router = useRouter();
  const { data: sessionData, status } = useSession();

  const [isShowEditForm, setShowEditForm] = useState(false);
  const [isDeletingRecord, setDeletingRecord] = useState(false);

  const [homePageHref, setHomePageHref] = useState("/");

  const { data: record, refetch: refetchGetRecord } =
    trpc.record.getRecord.useQuery(id as string, {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      initialData: initialRecord,
    });

  const { mutate: deleteRecord, isSuccess: isDeleteRecordSuccess } =
    trpc.record.deleteRecord.useMutation();

  const toggleShowingForm = useCallback(() => {
    setShowEditForm((prev) => !prev);
  }, []);

  const addQueryParamToRefetchDataOnHomePage = useCallback(() => {
    setHomePageHref("/?update=1");
  }, []);

  const handleDeleteRecord = useCallback(
    (id: string) => {
      addQueryParamToRefetchDataOnHomePage();
      deleteRecord(id);
      setDeletingRecord(true);
    },
    [deleteRecord, addQueryParamToRefetchDataOnHomePage]
  );

  const handleRefetchData = useCallback(async () => {
    addQueryParamToRefetchDataOnHomePage();
    await refetchGetRecord();
    toggleShowingForm();
    return;
  }, [
    refetchGetRecord,
    toggleShowingForm,
    addQueryParamToRefetchDataOnHomePage,
  ]);

  useEffect(() => {
    if (isDeleteRecordSuccess) {
      router.push(homePageHref);
    }
  }, [isDeleteRecordSuccess, router, homePageHref]);

  useEffect(() => {
    if (recordUsedData.userId !== sessionData?.user?.id) {
      router.push(homePageHref);
    }
  }, [recordUsedData.userId, sessionData?.user?.id, homePageHref, router]);

  const showLoader =
    isDeletingRecord ||
    status === "loading" ||
    recordUsedData.userId !== sessionData?.user?.id;

  if (showLoader) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  if (!record) {
    return (
      <div className={`${twCenteringBlock}`}>
        <div className="flex flex-col gap-2">
          <div>Record was not found</div>
          <Link className={twButton} href="/">
            back
          </Link>
        </div>
      </div>
    );
  }

  const DiscardButton: ReactNode = (
    <button className={twButton} onClick={() => setShowEditForm(false)}>
      discard
    </button>
  );

  const date = new Date(record.timestamp);

  return (
    <>
      <Head>
        <title>Dialga</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="align-between flex min-h-screen flex-col justify-between gap-1 p-6 text-slate-900 dark:text-white"
        key={record.id}
      >
        <div className="flex flex-col gap-10">
          <div className="flex justify-between">
            <Link className="h-fit" href={homePageHref}>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="arrow-alt-circle-left"
                className="h-7 w-7"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zm-72-20v40c0 6.6-5.4 12-12 12H256v67c0 10.7-12.9 16-20.5 8.5l-99-99c-4.7-4.7-4.7-12.3 0-17l99-99c7.6-7.6 20.5-2.2 20.5 8.5v67h116c6.6 0 12 5.4 12 12z"
                ></path>
              </svg>
            </Link>

            <div>{recordUsedData.userName}</div>
          </div>
          <div className="flex flex-col gap-4">
            <div
              className={`flex gap-2 ${
                record.type === "INCOME" ? "text-green-500" : ""
              }`}
            >
              <h3 className={twHeading}>
                {record.type === "EXPENSE" ? "- " : "+ "}
                {numToFloat(+record.amount)}
              </h3>
              <h3 className={twHeading}>
                {getCurrencySymbol(record.currency)}
              </h3>
            </div>
            <p className="text-base text-gray-700 dark:text-slate-200">
              {}
              {date.getDate()}.{date.getMonth()}.{date.getFullYear()}
            </p>

            <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
              {`Description: ${record.name}`}
            </h5>

            {record.message ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                {`Message: ${record.message}`}
              </h5>
            ) : null}
            {record.category ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                {`Category: ${record.category}`}
              </h5>
            ) : null}
          </div>

          {isShowEditForm ? (
            <RecordForm
              sessionUserId={recordUsedData.userId as string}
              handleRefetchData={handleRefetchData}
              currentRecord={record}
              discardButton={DiscardButton}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-6 pb-12">
          {!isShowEditForm ? (
            <button className={twButton} onClick={toggleShowingForm}>
              edit
            </button>
          ) : null}
          <button
            className={twButton}
            onClick={() => handleDeleteRecord(record.id)}
          >
            delete
          </button>
        </div>
      </div>
    </>
  );
};

export default RecordPage;
