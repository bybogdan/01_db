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

const AMOUNT_FOR_PAGINATION = 10;

export const Comp: React.FC<IComp> = ({ sessionUserId, sessionUserName }) => {
  const [amount, setAmount] = useState(AMOUNT_FOR_PAGINATION);
  const [isAwaitingFreshData, setAwaitingFreshData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [stateData, setStateData] = useState<{
    records: Record[];
    totalRecordsAmount: number;
    balance: number;
    categories: string[];
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
    !stateData ||
    !currenciesData ||
    (!isSuccess && !isLoadingMore) ||
    isAwaitingFreshData;

  if (showLoader) {
    return (
      <LoaderWithHeader userName={sessionUserName} userId={sessionUserId} />
    );
  }

  const { records, totalRecordsAmount, balance, categories } = stateData;

  return (
    <div className="align-between relative flex min-h-screen flex-col text-slate-900 dark:text-white">
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
        <div ref={formWrapperRef}>
          <RecordForm
            sessionUserId={sessionUserId}
            handleRefetchData={handleRefetchData}
            categories={categories as string[]}
            currenciesData={currenciesData}
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
