import { z } from "zod";
import { capitalizeString, numToFloat } from "../../../utils/common";
import {
  currencyResponse,
  currencyResponseType,
} from "../../../utils/mocks/currency";

import CurrencyAPI from "@everapi/currencyapi-js";

import type { UserIdSchema } from "../../schema/post.schema";
import {
  createRecordSchema,
  createUserIdSchema,
} from "../../schema/post.schema";

import { env } from "../../../env/server.mjs";

import { router, publicProcedure } from "../trpc";

const ONE_DAY = 1000 * 60 * 60 * 24;

const getCurrrency = async () => {
  return await new CurrencyAPI(env.CURRENCYAPI_KEY)?.latest({
    currencies: ["EUR", "GEL", "RUB"],
  });
};

const getAll = (userId: UserIdSchema) => {
  if (!userId) {
    return [];
  }
  return prisma?.record.findMany({
    where: {
      userId: userId,
    },
    orderBy: [
      {
        timestamp: "desc",
      },
    ],
  });
};

const getTolatExpense = async (userId: UserIdSchema) => {
  if (!userId) {
    return {};
  }
  const records = await prisma?.record.findMany({
    where: {
      userId: userId,
      type: "EXPENSE",
    },
  });
  if (!records) {
    return {};
  }

  const totalExpenseByCurrency = records.reduce(
    (acc: { [key: string]: number }, record) => {
      const key = record.currency;
      if (acc[key] === undefined) {
        acc[key] = 0;
      }
      acc[key] += +record.amount;
      return acc;
    },
    {}
  );
  return totalExpenseByCurrency;
};

const getExpensesSortedByCurrency = async (
  userId?: UserIdSchema,
  from?: string,
  to?: string
) => {
  if (!userId) {
    return {};
  }
  const records = await prisma?.record.findMany({
    where: {
      userId: userId,
      type: "EXPENSE",
    },
  });
  if (!records) {
    return {};
  }

  return records.reduce((acc: { [key: string]: number }, record) => {
    const key = record.currency;
    if (acc[key] === undefined) {
      acc[key] = 0;
    }

    acc[key] += +record.amount;
    return acc;
  }, {});
};

export const recordRouter = router({
  getAll: publicProcedure
    .input(createUserIdSchema)
    .query(({ input: userId }) => {
      if (!userId) {
        return [];
      }
      return getAll(userId);
    }),
  totalExpense: publicProcedure
    .input(createUserIdSchema)
    .query(async ({ input: userId }) => {
      return getTolatExpense(userId);
    }),
  getExpensesSortedByCurrency: publicProcedure
    .input(createUserIdSchema)
    .query(async ({ input: userId }) => getExpensesSortedByCurrency(userId)),
  getData: publicProcedure
    .input(createUserIdSchema)
    .query(async ({ input: userId }) => {
      const records = await getAll(userId);
      const totalExpensesSortedByCurrency = await getExpensesSortedByCurrency(
        userId
      );

      const isDevMode = process.env.NODE_ENV === "development";
      let currenciesResponse: currencyResponseType = currencyResponse;
      const currencies = await prisma?.currencies.findMany();

      if (isDevMode) {
        currenciesResponse =
          currencies?.length && currencies[0]?.value
            ? (currencies[0].value as currencyResponseType)
            : currenciesResponse;
      } else if (!currencies?.length) {
        currenciesResponse = await getCurrrency();

        await prisma?.currencies.create({
          data: {
            value: currenciesResponse,
          },
        });
      } else if (currencies[0]?.timestamp) {
        const timeNow = +new Date();
        const isCurrencyStale = +currencies[0].timestamp + ONE_DAY < timeNow;

        if (isCurrencyStale) {
          await prisma?.currencies.delete({
            where: {
              id: currencies[0].id,
            },
          });
          currenciesResponse = await getCurrrency();
          await prisma?.currencies.create({
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
  getRecord: publicProcedure.input(z.string()).query(async ({ input: id }) => {
    return await prisma?.record.findFirst({
      where: {
        id,
      },
    });
  }),
  setRecord: publicProcedure
    .input(createRecordSchema)
    .mutation(async ({ input: recordData }) => {
      const newRecord = await prisma?.record.create({
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
    .mutation(async ({ input }) => {
      const { id, updRecordData } = input;

      if (!id) {
        throw new Error("don't have id");
      }
      const updatedRecord = await prisma?.record.update({
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
    .mutation(async ({ input: id }) => {
      if (!id) {
        throw new Error("don't have id");
      }
      const updatedRecord = await prisma?.record.delete({
        where: {
          id,
        },
      });
      return updatedRecord;
    }),
});
