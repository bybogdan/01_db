import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const recordRouter = router({
  getAll: publicProcedure
    .input(z.string().nullish())
    .query(({ input: userId }) => {
      if (!userId) {
        return [];
      }
      return prisma?.record.findMany({
        where: {
          userId: userId,
        },
      });
    }),
  totalExpense: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input: userId }) => {
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
    }),
  setRecord: publicProcedure
    .input(
      z.object({
        type: z.enum(["INCOME", "EXPENSE"]),
        name: z.string(),
        message: z.string().nullish(),
        amount: z.string(),
        currency: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input: recordData }) => {
      const newRecord = await prisma?.record.create({
        data: recordData,
      });
      return newRecord;
    }),
});
