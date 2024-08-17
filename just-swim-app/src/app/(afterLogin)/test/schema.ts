import { z } from "zod";

const titleRegexp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |(|)|\-|\_|\[|\]]+$/g;

export const testSchema = z.object({
  title: z.string().min(5, '최소 5글자를 입력해주세요.').regex(titleRegexp, '( ) _ - [ ]를 제외한 특수문자는 사용할 수 없습니다.'),
  content: z.string(),
})

export type testType = z.infer<typeof testSchema>;