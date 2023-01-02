import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import superjson from "superjson";
import Head from "next/head";
import Link from "next/link";
import { createContext } from "../../server/trpc/context";
import { appRouter } from "../../server/trpc/router/_app";
import type { Record, RecordType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { twCenteringBlock } from "../../utils/twCommon";
import { Loader } from "../../components/Loader";
import { prisma } from "../../server/db/client";
import { RecordCard } from "../../components/RecordCard";
import { RecordsList } from "../../components/RecordsList";
import { capitalizeString, numToFloat } from "../../utils/common";
import { useEffect } from "react";
import { router } from "../../server/trpc/trpc";
import { useRouter } from "next/router";
import { currencyResponseType } from "../../types/misc";

type recordTimestampNumberType = {
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

type accType = {
  [key: string]: recordTimestampNumberType[];
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

  const recordsByMonths = records?.reduce((acc: accType, record) => {
    const dateKey = `${
      record.timestamp.getMonth() + 1
    }.${record.timestamp.getFullYear()}`;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey]?.push({
      ...record,
      timestamp: +record.timestamp,
    });

    return acc;
  }, {});

  return {
    props: {
      userId,
      // trpcState: ssg.dehydrate(),
      recordsByMonths,
      currency: currency.data,
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
  const { recordsByMonths, userId, currency } = props;
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
          {Object.entries(recordsByMonths).map(([month, records]) => {
            const recordsByCategories = records.reduce(
              (
                acc: {
                  [key: string]: {
                    records: recordTimestampNumberType[];
                    income: number;
                    expense: number;
                  };
                },
                record
              ) => {
                const key =
                  record.category !== null && record.category
                    ? record.category
                    : "UNSPECIFIED";
                if (!acc[key]) {
                  acc[key] = {
                    income: 0,
                    expense: 0,
                    records: [],
                  };
                }

                const recordByCategory = acc[key];

                if (recordByCategory) {
                  if (record.type === "INCOME") {
                    if (record.currency === "USD") {
                      recordByCategory.income += +record.amount;
                    } else {
                      const currentCurrency = currency[record.currency]?.value;
                      const amountConvertedToUSD = currentCurrency
                        ? +record.amount / currentCurrency
                        : 0;
                      recordByCategory.income += +amountConvertedToUSD;
                    }
                  }
                  if (record.type === "EXPENSE") {
                    if (record.currency === "USD") {
                      recordByCategory.expense += +record.amount;
                    } else {
                      const currentCurrency = currency[record.currency]?.value;
                      const amountConvertedToUSD = currentCurrency
                        ? +record.amount / currentCurrency
                        : 0;
                      recordByCategory.expense += +amountConvertedToUSD;
                    }
                  }
                  recordByCategory.records.push(record);
                }

                return acc;
              },
              {}
            );

            const income = Object.values(recordsByCategories).reduce(
              (acc, { income }) => acc + income,
              0
            );
            const expense = Object.values(recordsByCategories).reduce(
              (acc, { expense }) => acc + expense,
              0
            );
            const balance = income - expense;

            return (
              <div className="" key={`stats-${month}`}>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  Stats for: {month}
                </h5>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  Amount of transactions: {records.length}
                </h5>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("balance")}: {numToFloat(balance)}
                </h5>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("income")}: {numToFloat(income)}
                </h5>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  {capitalizeString("expense")}: {numToFloat(expense)}
                </h5>
                <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                  Categories:
                </h5>
                {Object.entries(recordsByCategories).map(([category, data]) => (
                  <div key={`stats-${category}`}>
                    <h5 className="mb-2 text-xl leading-tight text-gray-900 dark:text-white">
                      {capitalizeString(category)}: {data.records.length}
                    </h5>
                  </div>
                ))}
                <hr className="my-6 border-gray-300" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Stats;
