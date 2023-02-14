import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { GetDataType } from "../../types/misc";
import { LoaderSize } from "../../types/misc";
import { trpc } from "../../utils/trpc";
import { twButton, twCenteringBlock } from "../../utils/twCommon";
import { BalanceAmount } from "../BalanceAmount";
import { Header } from "../Header";
import { Loader } from "../Loader";
import { RecordForm } from "../RecordForm";
import { RecordsList } from "../RecordsList";

interface IComp {
  sessionUserName: string;
  sessionUserId: string;
}

const AMOUNT_FOR_PAGINATION = 10;

export const Comp: React.FC<IComp> = ({ sessionUserId, sessionUserName }) => {
  const [amount, setAmount] = useState(AMOUNT_FOR_PAGINATION);
  const [isAwaitingFreshData, setAwaitingFreshData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [stateData, setStateData] = useState<GetDataType>();

  const {
    isSuccess,
    isFetching,
    refetch: refetchGetData,
  } = trpc.record.getData.useQuery(
    { userId: sessionUserId, amount },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setStateData({
          ...data,
          categories: data.categories as string[],
        });
        setIsLoadingMore(false);
      },
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

  const router = useRouter();

  const handleRefetchData = useCallback(async () => {
    await refetchGetData();
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

  const showLoader =
    !stateData ||
    !currenciesData ||
    (!isSuccess && !isLoadingMore) ||
    isAwaitingFreshData;

  if (showLoader) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  const { records, totalRecordsAmount, stats, categories } = stateData;
  const balance = +(stats.balance || 0);

  return (
    <div className="align-between flex  min-h-screen flex-col text-slate-900 dark:text-white">
      <div className="flex flex-col gap-12 pt-6 pl-6 pr-6">
        <Header
          userName={sessionUserName}
          userId={sessionUserId}
          homePageHref="/"
        />
        <div className="flex flex-col gap-2">
          <div className=" flex  flex-col items-center justify-center  gap-2 text-2xl font-semibold">
            <span>Balance from last 30 days:</span>
            <BalanceAmount balance={balance} />
          </div>
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
        {(records.length >= AMOUNT_FOR_PAGINATION &&
          totalRecordsAmount > amount) ||
        isLoadingMore ? (
          <button
            className={twButton}
            onClick={async () => {
              setIsLoadingMore(true);
              setAmount((prev) => prev + AMOUNT_FOR_PAGINATION);
              await refetchGetData();
            }}
          >
            {isLoadingMore ? <Loader size={LoaderSize.SMALL} /> : "Load more"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const LoggedIn = memo(Comp);
