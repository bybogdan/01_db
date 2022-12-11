import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const recordRouter = router({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string().nullish() }).nullish())
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input?.text ?? "world"}`,
  //     };
  //   }),
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
