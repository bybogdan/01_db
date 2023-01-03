import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import type { Record, RecordType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { twCenteringBlock } from "../../utils/twCommon";
import { FunLoader } from "../../components/Loader";
import { prisma } from "../../server/db/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { currencyResponseType } from "../../types/misc";
import { StatsMonth } from "../../components/StatsMonth";
import { BASE_CURRENCY } from "../../utils/common";
import { BaseHeader } from "../../components/BaseHeader";

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

export type recordsDataByMonthsType = {
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

  const recordsDataByMonths = records?.reduce(
    (acc: recordsDataByMonthsType, record) => {
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
        item.expense += getConvertedToBaseCurrencyRecordAmount(
          record,
          currency
        );
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
          recordByCategory.income += getConvertedToBaseCurrencyRecordAmount(
            record,
            currency
          );
        }
        if (record.type === "EXPENSE") {
          recordByCategory.expense += getConvertedToBaseCurrencyRecordAmount(
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
    },
    {}
  );

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
        <FunLoader />
      </div>
    );
  }

  const getIsLastItem = (index: number) =>
    Object.keys(recordsDataByMonths).length === index + 1;

  return (
    <>
      <Head>
        <title>Dialga:Stats</title>
        <meta name="description" content="Dialga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="align-between flex min-h-screen flex-col gap-8 p-6 text-slate-900 dark:text-white">
        <BaseHeader
          userName={(sessionData.user.name as string) || ""}
          homePageHref="/"
        />
        <div>
          {Object.entries(recordsDataByMonths).map(
            (recordDataByMonth, index) => (
              <div key={`stats-month-${index}`}>
                <StatsMonth data={recordDataByMonth} />
                {!getIsLastItem(index) ? (
                  <hr className="my-6 border-gray-300" />
                ) : null}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Stats;
