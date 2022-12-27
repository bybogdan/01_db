import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure
    .input(z.string())
    .query(async ({ input: id, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id,
        },
      });

      return user;
    }),
});
