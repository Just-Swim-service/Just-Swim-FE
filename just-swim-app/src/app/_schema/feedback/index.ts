import { z } from 'zod';

export const dateSchema = z.coerce.date();

const MAX_FILE_SIZE = 100 * 1024 * 1024; //* 100MB 사이즈 제한
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// 동영상 파일 타입 추가
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
];

const ACCEPTED_FILE_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

const MAX_FILE_LENGTH = 4;
const checkFileLength = (file: string) => file.length <= MAX_FILE_LENGTH;

// zod 유효성 검사를 위한 schema 선언
export const formSchema = z.object({
  target: z.string().min(1).optional(),
  date: z.string().min(1),
  // file: z.any().optional(),
    file: z
        .any()
        .optional()
        .refine(
            (files) => !files || files.length <= MAX_FILE_LENGTH,
            `최대 ${MAX_FILE_LENGTH}개의 파일만 업로드 가능합니다.`,
        )
        .refine(
            (files) =>
                !files ||
                Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE),
            `파일당 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드할 수 있습니다.`,
        )
        .refine(
            (files) =>
                !files ||
                Array.from(files).every((file: any) => ACCEPTED_FILE_TYPES.includes(file.type)),
            '지원되지 않는 파일 형식입니다. (jpg, png, mp4 등)',
        ),
  link: z.string().nullable().optional(),
  content: z.string().refine((str) => str.length !== 0, '피드백은 필수입니다.'),
});

// 자동 완성을 위해 type 선언
export type FormType = z.infer<typeof formSchema>;
export type DateSchema = z.infer<typeof dateSchema>;
