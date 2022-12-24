import { z } from "zod";
import { capitalizeString, numToFloat } from "../../../utils/common";
import type { currencyResponseType } from "../../../utils/mocks/currency";
import { currencyResponse } from "../../../utils/mocks/currency";

import CurrencyAPI from "@everapi/currencyapi-js";

import { createRecordSchema } from "../../schema/post.schema";

import { env } from "../../../env/server.mjs";

import { router, publicProcedure } from "../trpc";

const ONE_DAY = 1000 * 60 * 60 * 24;

const getCurrrency = async () => {
  return await new CurrencyAPI(env.CURRENCYAPI_KEY)?.latest({
    currencies: ["EUR", "GEL", "RUB"],
  });
};

export const recordRouter = router({
  getData: publicProcedure
    .input(z.string())
    .query(async ({ input: userId, ctx }) => {
      const records = await ctx.prisma.record.findMany({
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
        ? records
            .filter((record) => record.type === "EXPENSE")
            .reduce((acc: { [key: string]: number }, record) => {
              const key = record.currency;
              if (acc[key] === undefined) {
                acc[key] = 0;
              }

              acc[key] += +record.amount;
              return acc;
            }, {})
        : {};

      const isDevMode = process.env.NODE_ENV === "development";
      let currenciesResponse: currencyResponseType = currencyResponse;
      const currencies = await ctx.prisma.currencies.findMany();

      if (isDevMode) {
        currenciesResponse =
          currencies?.length && currencies[0]?.value
            ? (currencies[0].value as currencyResponseType)
            : currenciesResponse;
      } else if (!currencies?.length) {
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

      const expenseValue = Object.keys(totalExpensesSortedByCurrency).reduce(
        (acc, key: string) => {
          if (key === "USD") {
            acc += +(totalExpensesSortedByCurrency[key] as number);
          } else {
            const currency = currenciesResponse.data[key]?.value;
            if (currency) {
              acc += +(totalExpensesSortedByCurrency[key] as number) / currency;
            }
          }
          return acc;
        },
        0
      );

      const expense: [string, string] = [numToFloat(expenseValue), "USD"];

      return { records, expense };
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
