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
    .input(z.string().nullish().nullish())
    .query(({ ctx, input: userId }) => {
      if (!userId) {
        return [];
      }
      return ctx.prisma.record.findMany({
        where: {
          userId: userId,
        },
      });
    }),
});
