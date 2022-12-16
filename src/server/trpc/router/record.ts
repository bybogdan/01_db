import { z } from "zod";

import { createRecordSchema } from "../../schema/post.schema";

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
    .input(createRecordSchema)
    .mutation(async ({ input: recordData }) => {
      const newRecord = await prisma?.record.create({
        data: recordData,
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
        data: updRecordData,
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
