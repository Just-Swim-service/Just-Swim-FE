import { z } from "zod";

export const testSchema = z.object({
  title: z.string().min(1).max(15),
  content: z.string().min(1).max(30),
})

export type testType = z.infer<typeof testSchema>;