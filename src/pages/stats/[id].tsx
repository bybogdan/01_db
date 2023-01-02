import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { Record, RecordType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { twCenteringBlock } from "../../utils/twCommon";
import { Loader } from "../../components/Loader";
import { prisma } from "../../server/db/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { currencyResponseType } from "../../types/misc";
import { StatsMonth } from "../../components/StatsMonth";
import { BASE_CURRENCY } from "../../utils/common";

export type recordTimestampNumberType = {
  id: string;
  type: RecordType;
  category: string | null;
  name: string;
  message: string | null;
  amount: string;
  currency: string;
  timestamp: number;
  userId: string;
};

export type recordsByCategroriesType = {
  [key: string]: {
    records: recordTimestampNumberType[];
    income: number;
    expense: number;
  };
};

export type accType = {
  [key: string]: {
    records: recordTimestampNumberType[];
    income: number;
    expense: number;
    recordsByCategories: recordsByCategroriesType;
  };
};

const getConvertedToBaseCurrencyRecordAmount = (
  record: Record,
  currency: currencyResponseType
): number => {
  if (record.currency === BASE_CURRENCY) {
    return +record.amount;
  } else {
    const currencyValue = currency.data[record.currency]?.value || 1;
    return +record.amount / currencyValue;
  }
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const userId = context.params?.id as string;

  const records = await prisma.record.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        timestamp: "desc",
      },
    ],
  });

  const currencies = await prisma.currencies.findMany({
    orderBy: [
      {
        timestamp: "desc",
      },
    ],
  });

  const currency = currencies[0]?.value as currencyResponseType;

  const recordsDataByMonths = records?.reduce((acc: accType, record) => {
    const dateKey = `${
      record.timestamp.getMonth() + 1
    }.${record.timestamp.getFullYear()}`;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        records: [],
        income: 0,
        expense: 0,
        recordsByCategories: {},
      };
    }

    const item = acc[dateKey];
    if (!item) {
      return acc;
    }

    item.records.push({
      ...record,
      timestamp: +record.timestamp,
    });

    if (record.type === "INCOME") {
      item.income += getConvertedToBaseCurrencyRecordAmount(record, currency);
    }
    if (record.type === "EXPENSE") {
      item.expense += getConvertedToBaseCurrencyRecordAmount(record, currency);
    }

    const key =
      record.category !== null && record.category
        ? record.category
        : "UNSPECIFIED";

    if (!item.recordsByCategories[key]) {
      item.recordsByCategories[key] = {
        income: 0,
        expense: 0,
        records: [],
      };
    }

    const recordByCategory = item.recordsByCategories[key];

    if (recordByCategory !== undefined) {
      if (record.type === "INCOME") {
        recordByCategory.income = getConvertedToBaseCurrencyRecordAmount(
          record,
          currency
        );
      }
      if (record.type === "EXPENSE") {
        recordByCategory.expense = getConvertedToBaseCurrencyRecordAmount(
          record,
          currency
        );
      }
      recordByCategory.records.push({
        ...record,
        timestamp: +record.timestamp,
      });
    }
    return acc;
  }, {});

  return {
    props: {
      userId,
      recordsDataByMonths,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: users.map((user) => ({
      params: {
        id: user.id,
      },
    })),
    fallback: "blocking",
  };
};

const Stats = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { recordsDataByMonths, userId } = props;
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && sessionData?.user?.id !== userId) {
      router.push("/");
    }
  }, [sessionData?.user?.id, status, userId, router]);

  if (status === "loading" || sessionData?.user?.id !== userId) {
    return (
      <div className={`${twCenteringBlock}`}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dialga</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-8 p-6 text-slate-900 dark:text-white">
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
          </div>
        </div>
        <div>
          {Object.entries(recordsDataByMonths).map(
            (recordDataByMonth, index) => (
              <StatsMonth
                key={`stats-month-${index}`}
                data={recordDataByMonth}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Stats;
