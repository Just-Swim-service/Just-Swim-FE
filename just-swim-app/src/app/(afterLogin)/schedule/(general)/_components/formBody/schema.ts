import { z } from "zod";

const titleRegexp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |(|)|\-|\_|\[|\]]+$/g;

export const lectureSchema = z.object({
  lectureTitle: 
    z
    .string()
    .min(1, "수업명을 입력해주세요.")
    .max(15, "최대 15글자만 입력할 수 있습니다.")
    .regex(titleRegexp, '( ) [ ] - _를 제외한 특수문자는 입력할 수 없습니다.'),
  lectureContent: 
    z
    .string()
    .min(1, "수업 설명을 입력해주세요.")
    .max(30, "최대 30글자만 입력할 수 있습니다."),
  lectureTime: 
    z
    .string(),
  lectureDays:
    z
    .string()
    .min(1, "수업 요일을 선택해주세요."),
  lectureLocation: 
    z
    .string()
    .min(1, "수업 장소를 선택해주세요."),
  lectureEndDate: z.string(),
  lectureColor: z.string(),
})
.superRefine(({ lectureTime }, ctx) => {
  if (lectureTime.length < 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "시간을 입력해주세요.",
      path: ["lectureTime"]
    });
  }

  const [from, to] = lectureTime.split('-').map(v => parseInt(v.split(':').join('')));

  if (from >= to) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "종료 시간을 시작 시간 이후로 입력해주세요.",
      path: ["lectureTime"]
    });
  }
})

export type LectureType = z.infer<typeof lectureSchema>;