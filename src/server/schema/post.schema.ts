import type { TypeOf } from "zod";
import { z } from "zod";

export const createRecordSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z.string().nullish(),
  message: z.string().nullish(),
  category: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  amount: z.string(),
  amountUSD: z.string().nullish(),
  currency: z.string(),
  userId: z.string(),
});

export const createUserIdSchema = z.string().nullish();

export type RecordSchema = TypeOf<typeof createRecordSchema>;
export type UserIdSchema = TypeOf<typeof createUserIdSchema>;
