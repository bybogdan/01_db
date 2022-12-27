import { memo, useCallback, useState } from "react";
import { trpc } from "../../utils/trpc";
import { twCenteringBlock } from "../../utils/twCommon";
import { Header } from "../Header";
import { Loader } from "../Loader";
import { RecordForm } from "../RecordForm";
import { RecordsList } from "../RecordsList";

interface IComp {
  sessionUserName: string;
  sessionUserId: string;
}

export const Comp: React.FC<IComp> = ({ sessionUserId, sessionUserName }) => {
  const {
    isSuccess,
    isFetching,
    data,
    refetch: refetchGetData,
  } = trpc.record.getData.useQuery(sessionUserId, {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const [isFetchingAfterAddedRecord, setFetchingAfterAddedRecord] =
    useState(false);

  const handleRefetchData = useCallback(
    async (afterRefetchCallback: () => void) => {
      setFetchingAfterAddedRecord(true);
      await refetchGetData();
      if (afterRefetchCallback) {
        afterRefetchCallback();
        setFetchingAfterAddedRecord(false);
      }
    },
    [refetchGetData]
  );

  if (!data) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  const { records, stats } = data;
  const isGeneralFetching = isFetching && !isFetchingAfterAddedRecord;

  return (
    <>
      {isSuccess && !isGeneralFetching ? (
        <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
          <Header sessionUserName={sessionUserName} stats={stats} />
          <div className="flex flex-col gap-12 p-6">
            <RecordForm
              sessionUserId={sessionUserId}
              handleRefetchData={handleRefetchData}
              isFetchingInParentComp={isFetchingAfterAddedRecord}
            />
            <RecordsList records={records} />
          </div>
        </div>
      ) : (
        <div className={`${twCenteringBlock}`}>
          <Loader />
        </div>
      )}
    </>
  );
};

export const LoggedIn = memo(Comp);