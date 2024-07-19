import { z } from "zod";

export const testSchema = z.object({
  title: z.string().max(15),
})

export type testType = z.infer<typeof testSchema>;