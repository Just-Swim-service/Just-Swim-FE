import { z } from 'zod';
import { CategoryType } from '@apis';

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
  category: z.nativeEnum(CategoryType).optional(),
  file: z
    .array(z.instanceof(File))
    .max(10, '이미지는 최대 10개까지 업로드할 수 있습니다')
    .optional(),
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
