import type { Record } from "@prisma/client";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderSize } from "../../types/misc";
import { trpc } from "../../utils/trpc";
import { twButton } from "../../utils/twCommon";
import { BalanceAmount } from "../BalanceAmount";
import { Header } from "../Header";
import { ArrowUp } from "../icons";
import { Loader } from "../Loader";
import { RecordForm } from "../RecordForm";
import { RecordsList } from "../RecordsList";
import { LoaderWithHeader } from "../LoaderWIthHeader";

interface IComp {
  sessionUserName: string;
  sessionUserId: string;
}

const AMOUNT_FOR_PAGINATION = 20;

export const Comp: React.FC<IComp> = ({ sessionUserId, sessionUserName }) => {
  const [amount, setAmount] = useState(AMOUNT_FOR_PAGINATION);
  const [isAwaitingFreshData, setAwaitingFreshData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [stateData, setStateData] = useState<{
    records: Record[];
    totalRecordsAmount: number;
    balance: number;
    currentMonthBalance: number;
    allTimeBalance: number;
    isShowCurrentMonthBalance: boolean;
    isShowFullBalance: boolean;
    isShowLast30DaysBalance: boolean;
    categories: string[];
    tags: string[] | null;
    currencies: string[];
    homePageCategory: string;
    homePageCategoryBalance: number;
    isAddTypeToHomeCategory: boolean;
  }>();
  const [isShowBackToStart, setShowBackToStart] = useState(false);

  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);

  const {
    isSuccess,
    isFetching,
    refetch: refetchGetData,
    data: storedData,
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
          tags: data?.tags as string[] | null,
          currencies: data.currencies as string[],
        });
        setIsLoadingMore(false);
      },
    }
  );

  const router = useRouter();

  const handleRefetchData = useCallback(async () => {
    await refetchGetData();
  }, [refetchGetData]);

  const handleBackToStart = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  // executed before render
  useMemo(() => {
    const { update } = router.query;
    router.replace("");
    if (update) {
      setAwaitingFreshData(true);
      return;
    }
    // set stored data from record.getData (if there is nothing changed)
    if (!update && storedData) {
      setStateData({
        ...storedData,
        categories: storedData?.categories as string[],
        tags: storedData?.tags as string[],
        currencies: storedData?.currencies as string[],
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFetching) {
      setAwaitingFreshData(false);
    }
  }, [isFetching]);

  useEffect(() => {
    const callBack = async () => {
      const anchorBottomPos =
        loadMoreRef.current?.getBoundingClientRect().bottom || null;

      const formBottomPos =
        formWrapperRef.current?.getBoundingClientRect().bottom || 0;

      if (formBottomPos < 0) {
        setShowBackToStart(true);
      } else {
        setShowBackToStart(false);
      }

      if (
        anchorBottomPos &&
        anchorBottomPos < window.innerHeight &&
        !isLoadingMore
      ) {
        setIsLoadingMore(true);
        setAmount((prev) => prev + AMOUNT_FOR_PAGINATION);
        await refetchGetData();
      }
    };
    window.addEventListener("scroll", callBack);

    return () => {
      window.removeEventListener("scroll", callBack);
    };
  }, [isLoadingMore, refetchGetData]);

  const showLoader =
    !stateData || (!isSuccess && !isLoadingMore) || isAwaitingFreshData;

  if (showLoader) {
    return (
      <LoaderWithHeader userName={sessionUserName} userId={sessionUserId} />
    );
  }

  const {
    records,
    totalRecordsAmount,
    balance,
    currentMonthBalance,
    allTimeBalance,
    isShowCurrentMonthBalance,
    isShowFullBalance,
    isShowLast30DaysBalance,
    categories,
    tags,
    currencies,
    homePageCategory,
    homePageCategoryBalance,
    isAddTypeToHomeCategory,
  } = stateData;

  return (
    <div className="align-between relative flex min-h-screen flex-col text-slate-900 dark:text-white">
      <div className="flex flex-col gap-12 pt-6 pl-6 pr-6">
        <Header
          userName={sessionUserName}
          userId={sessionUserId}
          homePageHref="/"
        />
        <div className="flex max-w-5xl flex-col items-center gap-2 self-center	">
          <div
            className={`flex flex-col items-center justify-center gap-2 text-2xl  font-semibold`}
          >
            {isShowCurrentMonthBalance ? (
              <>
                <span>Current month balance:</span>
                <BalanceAmount balance={currentMonthBalance} />
              </>
            ) : null}
            {isShowLast30DaysBalance ? (
              <>
                <span>Current month balancelance from last 30 days:</span>
                <BalanceAmount balance={currentMonthBalance} />
              </>
            ) : null}
            {isShowFullBalance ? (
              <>
                <span>Total balance:</span>
                <BalanceAmount balance={allTimeBalance} />
              </>
            ) : null}
          </div>

          {homePageCategory ? (
            <div className=" text-l flex items-center justify-center gap-2 font-semibold">
              <span>Total amount: {homePageCategory}</span>
              <BalanceAmount balance={homePageCategoryBalance} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex w-full max-w-5xl flex-col gap-12 self-center p-6">
        <div ref={formWrapperRef}>
          <RecordForm
            sessionUserId={sessionUserId}
            homePageCategory={homePageCategory}
            isAddTypeToHomeCategory={isAddTypeToHomeCategory}
            handleRefetchData={handleRefetchData}
            categories={categories as string[]}
            tags={tags}
            currenciesData={currencies}
          />
        </div>
        <RecordsList records={records} />
        {(records.length >= AMOUNT_FOR_PAGINATION &&
          totalRecordsAmount > amount) ||
        isLoadingMore ? (
          <button
            className="h-8"
            ref={loadMoreRef}
            onClick={async () => {
              setIsLoadingMore(true);
              setAmount((prev) => prev + AMOUNT_FOR_PAGINATION);
              await refetchGetData();
            }}
          >
            {isLoadingMore ? <Loader size={LoaderSize.BASE} /> : ""}
          </button>
        ) : null}
      </div>
      {isShowBackToStart ? (
        <div className="fixed p-6">
          <button onClick={handleBackToStart} className={twButton}>
            <ArrowUp />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export const LoggedIn = memo(Comp);
