import type { TypeOf } from "zod";
import { z } from "zod";

export const createRecordSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z.string(),
  message: z.string().nullish(),
  category: z.string().nullish(),
  amount: z.string(),
  currency: z.string(),
  userId: z.string(),
});

export const createUserIdSchema = z.string().nullish();

// export const createPostSchema = z.object({
//   title: z.string({
//     required_error: 'Title is required',
//   }),
//   content: string({
//     required_error: 'Content is required',
//   }),
//   category: string({
//     required_error: 'Category is required',
//   }),
//   image: string({
//     required_error: 'Image is required',
//   }),
//   published: boolean({
//     required_error: 'Published is required',
//   }),
// });

// export const params = object({
//   postId: string(),
// });

// export const updatePostSchema = object({
//   params,
//   body: object({
//     title: string(),
//     content: string(),
//     category: string(),
//     image: string(),
//     published: boolean(),
//   }).partial(),
// });

// export const filterQuery = object({
//   limit: number().default(1),
//   page: number().default(10),
// });

// export type CreatePostInput = TypeOf<typeof createPostSchema>;
// export type ParamsInput = TypeOf<typeof params>;
// export type UpdatePostInput = TypeOf<typeof updatePostSchema>['body'];
// export type FilterQueryInput = TypeOf<typeof filterQuery>;

export type RecordSchema = TypeOf<typeof createRecordSchema>;
export type UserIdSchema = TypeOf<typeof createUserIdSchema>;
