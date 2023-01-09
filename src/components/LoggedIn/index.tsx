import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  BASE_CURRENCY,
  capitalizeString,
  getCurrencySymbol,
  numToFloat,
} from "../../utils/common";
import { trpc } from "../../utils/trpc";
import { twButton, twCenteringBlock } from "../../utils/twCommon";
import { Header } from "../Header";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { records, stats, categories } = data;

  return (
    <>
      {isSuccess && !isAwaitingFreshData ? (
        <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
          <div className="flex flex-col gap-6 pt-6 pl-6 pr-6">
            <Header
              userName={sessionUserName}
              userId={sessionUserId}
              homePageHref="/"
            />
            <div className="flex flex-col gap-2">
              {stats &&
                Object.entries(stats).map(([key, value], index) => (
                  <div key={`${key}-${index}`}>{`${capitalizeString(
                    key
                  )}: ${numToFloat(+value)} ${getCurrencySymbol(
                    BASE_CURRENCY
                  )}`}</div>
                ))}
              <div>
                <Link className={twButton} href={`/stats/${sessionUserId}`}>
                  To stats
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 p-6">
            <RecordForm
              sessionUserId={sessionUserId}
              handleRefetchData={handleRefetchData}
              categories={categories as string[]}
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
