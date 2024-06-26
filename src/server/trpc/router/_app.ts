import { router } from "../trpc";
import { authRouter } from "./auth";
import { recordRouter } from "./record";
import { userRouter } from "./user";

export const appRouter = router({
  record: recordRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
