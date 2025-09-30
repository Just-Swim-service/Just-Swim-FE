import { z } from 'zod';

// Community 게시글 작성 폼 스키마
export const communitySchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(50, '제목은 50자 이하로 입력해주세요'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(1000, '내용은 1000자 이하로 입력해주세요'),
  workoutTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      '운동 시간은 숫자로 입력해주세요',
    ),
  workoutDistance: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      '운동 거리는 숫자로 입력해주세요',
    ),
  workoutIntensity: z
    .string()
    .optional()
    .refine(
      (val) => !val || ['낮음', '보통', '높음'].includes(val),
      '운동 강도를 선택해주세요',
    ),
});

export type CommunityFormData = z.infer<typeof communitySchema>;
