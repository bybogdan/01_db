import { z } from "zod";
import {
  BASE_CURRENCY,
  capitalizeString,
  numToFloat,
} from "../../../utils/common";

import { currencyResponseMock } from "../../../utils/mocks/currency";

import CurrencyAPI from "@everapi/currencyapi-js";

import { createRecordSchema } from "../../schema/post.schema";

import { env } from "../../../env/server.mjs";

import { router, publicProcedure } from "../trpc";
import type { Record, RecordType } from "@prisma/client";
import type {
  currencyResponseType,
  HeaderStatsType,
} from "../../../types/misc";

const ONE_DAY = 1000 * 60 * 60 * 24;

const getCurrrency = async () => {
  return await new CurrencyAPI(env.CURRENCYAPI_KEY)?.latest({
    currencies: ["EUR", "GEL", "RUB"],
  });
};

const getTotalRecordsTypeSortedByCurrency = (
  records: Record[],
  type: RecordType
) => {
  return records
    .filter((record) => record.type === type)
    .reduce((acc: { [key: string]: number }, record) => {
      const key = record.currency;
      if (acc[key] === undefined) {
        acc[key] = 0;
      }

      acc[key] += +record.amount;
      return acc;
    }, {});
};

const getTotalRecordsTypeValue = (
  totalRecordsTypeSortedByCurrency: {
    [key: string]: number;
  },
  currenciesResponse: currencyResponseType
) => {
  return Object.keys(totalRecordsTypeSortedByCurrency).reduce((acc, key) => {
    if (key === BASE_CURRENCY) {
      acc += +(totalRecordsTypeSortedByCurrency[key] as number);
    } else {
      const currency = currenciesResponse.data[key]?.value;
      if (currency) {
        acc += +(totalRecordsTypeSortedByCurrency[key] as number) / currency;
      }
    }
    return acc;
  }, 0);
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

      const totalExpensesSortedByCurrency = records.length
        ? getTotalRecordsTypeSortedByCurrency(records, "EXPENSE")
        : {};

      const totalIncomeSortedByCurrency = records.length
        ? getTotalRecordsTypeSortedByCurrency(records, "INCOME")
        : {};

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

      const expense: string = numToFloat(
        getTotalRecordsTypeValue(
          totalExpensesSortedByCurrency,
          currenciesResponse
        )
      );

      const income: string = numToFloat(
        getTotalRecordsTypeValue(
          totalIncomeSortedByCurrency,
          currenciesResponse
        )
      );

      const balance: string = numToFloat(+income - +expense);

      const stats: HeaderStatsType = {
        balance,
        expense,
        income,
      };

      return {
        records,
        stats,
      };
    }),
  getRecord: publicProcedure
    .input(z.string())
    .query(async ({ input: id, ctx }) => {
      return await ctx.prisma.record.findFirst({
        where: {
          id,
        },
      });
    }),
  setRecord: publicProcedure
    .input(createRecordSchema)
    .mutation(async ({ input: recordData, ctx }) => {
      const newRecord = await ctx.prisma.record.create({
        data: {
          ...recordData,
          name: capitalizeString(recordData.name),
          message: capitalizeString(recordData.message || ""),
        },
      });
      return newRecord;
    }),
  updateRecord: publicProcedure
    .input(
      z.object({
        updRecordData: createRecordSchema,
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, updRecordData } = input;

      if (!id) {
        throw new Error("don't have id");
      }
      const updatedRecord = await ctx.prisma.record.update({
        where: {
          id,
        },
        data: {
          ...updRecordData,
          name: capitalizeString(updRecordData.name),
          message: capitalizeString(updRecordData.message || ""),
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
});
