import { z } from "zod";
import { capitalizeString, numToFloat } from "../../../utils/common";

import { currencyResponseMock } from "../../../utils/mocks/currency";

import CurrencyAPI from "@everapi/currencyapi-js";

import { createRecordSchema } from "../../schema/post.schema";

import { env } from "../../../env/server.mjs";

import { router, publicProcedure } from "../trpc";
import type { Record, User } from "@prisma/client";
import type {
  currencyResponseType,
  HeaderStatsType,
} from "../../../types/misc";

const ONE_DAY = 1000 * 60 * 60 * 24;

export type recordsByCategroriesType = {
  [key: string]: {
    records: Record[];
    income: number;
    expense: number;
  };
};

export type recordsByType = {
  [key: string]: {
    recordsByCategories: recordsByCategroriesType;
    amount: number;
  };
};

type recordsDataByMonthsType = {
  [key: string]: {
    records: Record[];
    income: number;
    expense: number;
    recordsByType: recordsByType;
  };
};

const getRecordsDataByMonths = (records: Record[]) => {
  return records?.reduce((acc: recordsDataByMonthsType, record: Record) => {
    const dateKey = `${
      record.timestamp.getMonth() + 1
    }.${record.timestamp.getFullYear()}`;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        records: [],
        income: 0,
        expense: 0,
        recordsByType: {},
      };
    }

    const item = acc[dateKey];
    if (!item) {
      return acc;
    }

    item.records.push(record);

    if (!item.recordsByType[record.type as string]) {
      item.recordsByType[record.type as string] = {
        recordsByCategories: {},
        amount: 0,
      };
    }

    const recordByType = item.recordsByType[record.type as string];

    if (!recordByType) {
      return acc;
    }

    const categoryKey =
      record.category !== null && record.category
        ? record.category
        : "UNSPECIFIED";

    if (!recordByType.recordsByCategories[categoryKey]) {
      recordByType.recordsByCategories[categoryKey] = {
        income: 0,
        expense: 0,
        records: [],
      };
    }

    const recordByCategory = recordByType?.recordsByCategories[categoryKey];

    if (recordByCategory !== undefined) {
      const amountUSD = +record.amountUSD;

      if (record.type === "INCOME") {
        item.income += amountUSD;
        recordByCategory.income += amountUSD;
      }
      if (record.type === "EXPENSE") {
        item.expense += amountUSD;
        recordByCategory.expense += amountUSD;
      }
      recordByType.amount += amountUSD;

      recordByCategory.records.push(record);
    }
    return acc;
  }, {});
};

const getCurrrency = async () => {
  return await new CurrencyAPI(env.CURRENCYAPI_KEY)?.latest({
    currencies: ["EUR", "GEL", "RUB", "TRY"],
  });
};

export const recordRouter = router({
  getData: publicProcedure
    .input(z.string())
    .query(async ({ input: userId, ctx }) => {
      const records: Record[] = await ctx.prisma.record.findMany({
        where: {
          userId: userId,
        },
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });

      const isDevMode = process.env.NODE_ENV === "development";
      let currenciesResponse: currencyResponseType = currencyResponseMock;
      const currencies = await ctx.prisma.currencies.findMany({
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });

      if (isDevMode) {
        currenciesResponse =
          currencies?.length && currencies[0]?.value
            ? (currencies[0].value as currencyResponseType)
            : currenciesResponse;
      } else if (currencies.length === 0) {
        currenciesResponse = await getCurrrency();

        await ctx.prisma.currencies.create({
          data: {
            value: currenciesResponse,
          },
        });
      } else if (currencies[0]?.timestamp) {
        const timeNow = +new Date();
        const isCurrencyStale = +currencies[0].timestamp + ONE_DAY < timeNow;

        if (isCurrencyStale) {
          await ctx.prisma.currencies.delete({
            where: {
              id: currencies[0].id,
            },
          });
          currenciesResponse = await getCurrrency();
          await ctx.prisma.currencies.create({
            data: {
              value: currenciesResponse,
            },
          });
        } else {
          currenciesResponse = currencies[0].value as currencyResponseType;
        }
      }

      const expense: string = records.length
        ? numToFloat(
            records
              .filter((record) => record.type === "EXPENSE")
              .reduce((acc, record) => (acc += +record.amountUSD), 0)
          )
        : "0.00";

      const income: string = records.length
        ? numToFloat(
            records
              .filter((record) => record.type === "INCOME")
              .reduce((acc, record) => (acc += +record.amountUSD), 0)
          )
        : "0.00";

      const balance: string = numToFloat(+income - +expense);

      const stats: HeaderStatsType = {
        balance,
        expense,
        income,
      };

      const userData: User | null = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      return {
        records,
        stats,
        categories: userData?.categories || null,
      };
    }),
  getRecord: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input: id, ctx }) => {
      if (!id) {
        return;
      }
      return await ctx.prisma.record.findFirst({
        where: {
          id,
        },
      });
    }),
  setRecord: publicProcedure
    .input(createRecordSchema)
    .mutation(async ({ input: recordData, ctx }) => {
      const currencies = await ctx.prisma.currencies.findMany({
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });

      const currencyResponse = currencies[0]?.value as currencyResponseType;
      const currencyValue =
        currencyResponse.data[recordData.currency]?.value || 1;
      const amountUSD = (+recordData.amount / currencyValue).toString();

      const newRecord = await ctx.prisma.record.create({
        data: {
          ...recordData,
          name: capitalizeString(recordData.name),
          message: capitalizeString(recordData.message || ""),
          amountUSD,
        },
      });
      return newRecord;
    }),
  updateRecord: publicProcedure
    .input(
      z.object({
        updRecordData: createRecordSchema,
        id: z.string(),
        oldCurrency: z.string(),
        oldAmount: z.string(),
        oldAmountUSD: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, updRecordData, oldCurrency, oldAmount, oldAmountUSD } = input;

      if (!id) {
        throw new Error("don't have id");
      }

      let amountUSD: string;

      if (oldCurrency === updRecordData.currency) {
        if (oldAmount === updRecordData.amount) {
          amountUSD = updRecordData.amountUSD as string;
        } else {
          const currency = +oldAmount / +oldAmountUSD;
          amountUSD = (+updRecordData.amount / currency).toString();
        }
      } else {
        const currencies = await ctx.prisma.currencies.findMany({
          orderBy: [
            {
              timestamp: "desc",
            },
          ],
        });

        const currencyResponse = currencies[0]?.value as currencyResponseType;
        const currencyValue =
          currencyResponse.data[updRecordData.currency]?.value || 1;

        amountUSD = (+updRecordData.amount / currencyValue).toString();
      }

      const updatedRecord = await ctx.prisma.record.update({
        where: {
          id,
        },
        data: {
          ...updRecordData,
          name: capitalizeString(updRecordData.name),
          message: capitalizeString(updRecordData.message || ""),
          amountUSD,
        },
      });
      return updatedRecord;
    }),
  deleteRecord: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      if (!id) {
        throw new Error("don't have id");
      }
      const updatedRecord = await ctx.prisma.record.delete({
        where: {
          id,
        },
      });
      return updatedRecord;
    }),
  getStats: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input: userId, ctx }) => {
      if (!userId) {
        return;
      }
      const records = await ctx.prisma.record.findMany({
        where: {
          userId,
        },
        orderBy: [
          {
            timestamp: "desc",
          },
        ],
      });

      return getRecordsDataByMonths(records) as recordsDataByMonthsType;
    }),
});
