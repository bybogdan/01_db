import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { recordRouter } from "./record";

export const appRouter = router({
  example: exampleRouter,
  record: recordRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
