import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import { twCenteringBlock } from "../../utils/twCommon";
import { HomeHeader } from "../HomeHeader";
import { FunLoader } from "../Loader";
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

  const router = useRouter();

  const [isAwaitingFreshData, setAwaitingFreshData] = useState(false);

  const handleRefetchData = useCallback(async () => {
    await refetchGetData();
    return;
  }, [refetchGetData]);

  // executed before render
  useMemo(() => {
    const { update } = router.query;
    router.replace("");
    if (update) {
      setAwaitingFreshData(true);
    }
  }, []);

  useEffect(() => {
    if (!isFetching) {
      setAwaitingFreshData(false);
    }
  }, [isFetching]);

  if (!data) {
    return (
      <div className={`${twCenteringBlock}`}>
        <FunLoader />
      </div>
    );
  }

  const { records, stats } = data;

  return (
    <>
      {isSuccess && !isAwaitingFreshData ? (
        <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
          <HomeHeader
            sessionUserName={sessionUserName}
            sessionUserId={sessionUserId}
            stats={stats}
          />
          <div className="flex flex-col gap-12 p-6">
            <RecordForm
              sessionUserId={sessionUserId}
              handleRefetchData={handleRefetchData}
            />
            <RecordsList records={records} />
          </div>
        </div>
      ) : (
        <div className={`${twCenteringBlock}`}>
          <FunLoader />
        </div>
      )}
    </>
  );
};

export const LoggedIn = memo(Comp);
