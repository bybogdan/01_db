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
  setCategories: publicProcedure
    .input(
      z.object({
        id: z.string(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, categories } = input;
      await ctx.prisma.user.update({
        where: {
          id,
        },
        data: {
          categories,
        },
      });
    }),
});
