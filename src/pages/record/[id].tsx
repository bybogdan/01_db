import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import { RecordForm } from "../../components/RecordForm";
import { UseTrpcContext } from "../../hooks";
import { getCurrencySymbol, numToFloat } from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twHeading, twButton } from "../../utils/twCommon";

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
  const {
    data: record,
    isLoading,
    refetch: refetchGetRecord,
  } = trpc.record.getRecord.useQuery(id as string, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { deleteRecord, isUpdateRecordSuccess, isDeleteRecordSuccess } =
    UseTrpcContext();

  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (isDeleteRecordSuccess || isUpdateRecordSuccess) {
      refetchGetRecord();
    }
  }, [isUpdateRecordSuccess, isDeleteRecordSuccess, refetchGetRecord]);

  if (isLoading) {
    return <Loader />;
  }

  if (!record) {
    return <div> Record was not found</div>;
  }

  return (
    <div
      className="flex flex-col justify-center gap-1 text-slate-900 dark:text-white"
      key={record.id}
    >
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

      {/* <button
          className={twButton}
          onClick={() => deleteRecord(record.id)}
        >
          delete
        </button> */}
      <button
        className={twButton}
        onClick={() => setShowEditForm((prev) => !prev)}
      >
        {showEditForm ? "discard" : "edit"}
      </button>
      {showEditForm && (
        <RecordForm
          currentRecord={record}
          callbackAfterSubmit={() => setShowEditForm((prev) => !prev)}
        />
      )}
      <div className="pt-4" />
      <Link className={twButton} href="/">
        back
      </Link>
    </div>
  );
};

export default RecordPage;
