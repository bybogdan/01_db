import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
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

const RecordPage = () => {
  const router = useRouter();

  const { data: sessionData, status } = useSession();

  const [isShowEditForm, setShowEditForm] = useState(false);
  const [isDeletingRecord, setDeletingRecord] = useState(false);

  const [homePageHref, setHomePageHref] = useState("/");

  const {
    data: record,
    refetch: refetchGetRecord,
    isLoading,
    isFetching,
  } = trpc.record.getRecord.useQuery(router.query.id as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: userData } = trpc.user.getUser.useQuery(
    sessionData?.user?.id as string,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: currenciesData } = trpc.record.getCurrrency.useQuery(
    undefined,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

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
    toggleShowingForm();
    await refetchGetRecord();
  }, [
    refetchGetRecord,
    toggleShowingForm,
    addQueryParamToRefetchDataOnHomePage,
  ]);

  const showLoader =
    isLoading ||
    isFetching ||
    isDeletingRecord ||
    status === "loading" ||
    userData?.id !== sessionData?.user?.id ||
    !currenciesData;

  const shouldRedirectToHomePage =
    (status !== "loading" &&
      record?.userId &&
      sessionData?.user?.id &&
      record?.userId !== sessionData?.user?.id) ||
    isDeleteRecordSuccess;

  useEffect(() => {
    if (shouldRedirectToHomePage) {
      router.push(homePageHref);
    }
  }, [shouldRedirectToHomePage, homePageHref, router]);

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
            <p className="text-base text-gray-700 dark:text-slate-200">
              {date.getDate()}.{date.getMonth() + 1}.{date.getFullYear()}
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
              sessionUserId={userData?.id as string}
              handleRefetchData={handleRefetchData}
              currentRecord={record}
              discardButton={DiscardButton}
              categories={userData?.categories as string[]}
              currenciesData={currenciesData}
            />
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
