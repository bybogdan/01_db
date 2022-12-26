import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { RecordForm } from "../../components/RecordForm";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twHeading, twButton, twCenteringBlock } from "../../utils/twCommon";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import type { Record } from "@prisma/client";
import superjson from "superjson";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const req = context.req as NextApiRequest;
  const res = context.res as NextApiResponse;
  const ctx = await createContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  const id = context.query.id;
  try {
    const session = await caller.auth.getSession();

    if (!session?.user || !id) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const record = await caller.record.getRecord(id as string);

    return {
      props: {
        id,
        sessionData: {
          userName: session.user.name,
          userId: session.user.id,
        },
        initialRecord: superjson.serialize(record).json,
      },
    };
  } catch (err) {
    return {
      props: {
        id,
      },
    };
  }
};

interface IRecordPage {
  id: string;
  sessionData: {
    userName: string;
    userId: string;
  };
  initialRecord: Record;
}

const RecordPage: React.FC<IRecordPage> = ({
  id,
  sessionData,
  initialRecord,
}) => {
  const {
    data: record,
    isLoading: isGetRecordLoading,
    refetch: refetchGetRecord,
  } = trpc.record.getRecord.useQuery(id as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    initialData: initialRecord,
  });

  const router = useRouter();

  const { mutate: deleteRecord, isSuccess: isDeleteRecordSuccess } =
    trpc.record.deleteRecord.useMutation();

  const [isShowEditForm, setShowEditForm] = useState(false);
  const [isDeletingRecord, setDeletingRecord] = useState(false);
  const [isRefetchingAfterUpdatedRecord, setRefetchingAfterUpdatedRecord] =
    useState(false);

  const toggleShowingForm = useCallback(() => {
    setShowEditForm((prev) => !prev);
  }, []);

  const handleDeleteRecord = useCallback(
    (id: string) => {
      deleteRecord(id);
      setDeletingRecord(true);
    },
    [deleteRecord]
  );

  const handleRefetchData = useCallback(async () => {
    setRefetchingAfterUpdatedRecord(true);
    await refetchGetRecord();
    toggleShowingForm();
    setRefetchingAfterUpdatedRecord(false);
  }, [refetchGetRecord, toggleShowingForm]);

  useEffect(() => {
    if (isDeleteRecordSuccess) {
      router.push("/");
    }
  }, [isDeleteRecordSuccess, router]);

  if (isDeletingRecord) {
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
            <Link className="h-fit" href="/">
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

            <div>{sessionData.userName}</div>
          </div>
          <div>
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
            <div>
              <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900 dark:text-white">
                {record.name}
              </h5>
              <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900 dark:text-white">
                {record.message}
              </h5>
            </div>
          </div>

          {isShowEditForm ? (
            <RecordForm
              sessionUserId={sessionData.userId}
              handleRefetchData={handleRefetchData}
              isFetchingInParentComp={isRefetchingAfterUpdatedRecord}
              currentRecord={record}
              discardButton={DiscardButton}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
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
