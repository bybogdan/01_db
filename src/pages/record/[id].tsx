import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { RecordForm } from "../../components/RecordForm";
import {
  getCurrencySymbol,
  getIsStandalone,
  numToFloat,
} from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twHeading, twButton, twCenteringBlock } from "../../utils/twCommon";
import { useSession } from "next-auth/react";
import { Header } from "../../components/Header";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import { LoaderWithHeader } from "../../components/LoaderWIthHeader";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const recordId = context.params?.id as string;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  const record = await ssg.record.getRecord.fetch(recordId);
  const userData = await ssg.user.getUser.fetch(record?.userId);

  if (record) {
    return {
      props: {
        record: {
          ...record,
          timestamp: +record?.timestamp,
        },
        userData,
      },
    };
  }
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
  const initialRecord = {
    ...props.record,
    timestamp: new Date(props.record.timestamp),
  };

  const { userData } = props;

  const router = useRouter();

  const { data: sessionData, status } = useSession();

  const [isShowEditForm, setShowEditForm] = useState(false);
  const [isDeletingRecord, setDeletingRecord] = useState(false);

  const [homePageHref, setHomePageHref] = useState("/");

  const {
    data: record,
    refetch: refetchGetRecord,
    isLoading,
  } = trpc.record.getRecord.useQuery(router.query.id as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    initialData: initialRecord,
  });

  const { mutate: deleteRecord, isSuccess: isDeletedRecordSuccessfully } =
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
  }, [
    refetchGetRecord,
    toggleShowingForm,
    addQueryParamToRefetchDataOnHomePage,
  ]);

  const showLoader =
    isLoading ||
    isDeletingRecord ||
    status === "loading" ||
    record?.userId !== sessionData?.user?.id;

  const shouldRedirectToHomePage =
    (status !== "loading" &&
      record?.userId &&
      record?.userId !== sessionData?.user?.id) ||
    isDeletedRecordSuccessfully;

  useEffect(() => {
    if (shouldRedirectToHomePage) {
      router.push(homePageHref);
    }
  }, [shouldRedirectToHomePage, homePageHref, router]);

  if (showLoader || shouldRedirectToHomePage) {
    return (
      <LoaderWithHeader
        userName={sessionData?.user?.name ?? ""}
        userId={sessionData?.user?.id ?? ""}
      />
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

  const isStandalone: boolean = getIsStandalone();

  return (
    <>
      <Head>
        <title>Dialga:Record</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="align-between flex min-h-screen flex-col justify-between gap-1 p-6 text-slate-900 dark:text-white"
        key={record.id}
      >
        <div className="flex flex-col gap-10">
          <Header
            userName={userData?.name as string}
            userId={userData?.id as string}
            homePageHref={homePageHref}
          />
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

            {record.name ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                Description: {record.name}
              </h5>
            ) : null}

            {record.message ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                Message: {record.message}
              </h5>
            ) : null}
            {record.category ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                Category: {record.category}
              </h5>
            ) : null}
            {((record.tags as string[]) || null)?.length > 0 ? (
              <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                Tags: {(record.tags as string[]).join(", ")}
              </h5>
            ) : null}

            <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
              Date: {date.getDate()}.{date.getMonth() + 1}.{date.getFullYear()}
            </h5>
          </div>

          {isShowEditForm ? (
            <div className="mb-3">
              <RecordForm
                sessionUserId={userData?.id as string}
                handleRefetchData={handleRefetchData}
                currentRecord={record}
                discardButton={DiscardButton}
                categories={userData?.categories as string[]}
                tags={userData?.tags as string[] | null}
                currenciesData={userData?.currencies as string[]}
              />
            </div>
          ) : null}
        </div>

        <div className={`flex flex-col gap-6 ${!isStandalone ? "pb-14" : ""}`}>
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
