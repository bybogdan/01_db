import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useCallback } from "react";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { RecordForm } from "../../components/RecordForm";
import { UseTrpcContext } from "../../hooks";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twHeading, twButton, twCenteringBlock } from "../../utils/twCommon";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

interface IRecordPage {
  id: string;
}

const RecordPage: React.FC<IRecordPage> = ({ id }) => {
  const { data: sessionData, status } = useSession();
  const {
    data: record,
    isLoading,
    refetch: refetchGetRecord,
  } = trpc.record.getRecord.useQuery(id as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

  const { deleteRecord, isUpdateRecordSuccess, isDeleteRecordSuccess } =
    UseTrpcContext();

  const [showEditForm, setShowEditForm] = useState(false);

  const callbackAfterSubmit = useCallback(() => {
    setShowEditForm((prev) => !prev);
  }, []);

  const handleDeleteRecord = useCallback(
    (id: string) => {
      deleteRecord(id);
      router.push("/");
    },
    [deleteRecord, router]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (isUpdateRecordSuccess) {
      refetchGetRecord();
    }
  }, [
    isUpdateRecordSuccess,
    isDeleteRecordSuccess,
    refetchGetRecord,
    router,
    status,
  ]);

  if (isLoading || !sessionData?.user) {
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

  return (
    <div
      className="align-between flex min-h-screen flex-col justify-between gap-1 p-6 text-slate-900 dark:text-white"
      key={record.id}
    >
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
          <h3 className={twHeading}>{getCurrencySymbol(record.currency)}</h3>
        </div>
        <p className="text-base text-gray-700 dark:text-slate-200">
          {record.timestamp.getDate()}.{record.timestamp.getMonth()}.
          {record.timestamp.getFullYear()}
        </p>
        <div>
          <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900 dark:text-white">
            {record.name}
          </h5>
          <h5 className="mb-2 text-xl font-medium leading-tight text-gray-900 dark:text-white">
            {record.message}
          </h5>
        </div>

        {showEditForm ? (
          <RecordForm
            currentRecord={record}
            callbackAfterSubmit={callbackAfterSubmit}
            discardButton={DiscardButton}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {!showEditForm ? (
          <button className={twButton} onClick={callbackAfterSubmit}>
            edit
          </button>
        ) : null}
        <button
          className={twButton}
          onClick={() => handleDeleteRecord(record.id)}
        >
          delete
        </button>
        <Link className={twButton} href="/">
          back
        </Link>
      </div>
    </div>
  );
};

export default RecordPage;
