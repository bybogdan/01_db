import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import { twCenteringBlock } from "../../utils/twCommon";
import { BalanceAmount } from "../BalanceAmount";
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

  const { data: currenciesData } = trpc.record.getCurrrency.useQuery(
    undefined,
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

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

  const showLoader = !data || !currenciesData;

  if (showLoader) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  const { records, stats, categories } = data;

  const balance = +(stats.balance || 0);

  return (
    <>
      {isSuccess && !isAwaitingFreshData ? (
        <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
          <div className="flex flex-col gap-12 pt-6 pl-6 pr-6">
            <Header
              userName={sessionUserName}
              userId={sessionUserId}
              homePageHref="/"
            />
            <div className="flex flex-col gap-2 ">
              <div className="font-sbold  flex flex-col items-center justify-center gap-2 text-xl sm:text-xl">
                <span>Balance from last 30 days:</span>
                <BalanceAmount balance={balance} />
              </div>
              {/* {stats &&
                Object.entries(stats).map(([key, value], index) => (
                  <div key={`${key}-${index}`}>{`${capitalizeString(
                    key
                  )}: ${numToFloat(+value)} ${getCurrencySymbol(
                    BASE_CURRENCY
                  )}`}</div>
                ))} */}
            </div>
          </div>
          <div className="flex flex-col gap-12 p-6">
            <RecordForm
              sessionUserId={sessionUserId}
              handleRefetchData={handleRefetchData}
              categories={categories as string[]}
              currenciesData={currenciesData}
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
