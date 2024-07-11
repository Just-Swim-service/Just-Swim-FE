import { z } from 'zod';

export const dateSchema = z.coerce.date();


const MAX_FILE_SIZE = 20 * 1024 * 1024; //* 20MB 사이즈 제한
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/webp" ];

const MAX_FILE_LENGTH = 4;
const checkFileLength = (file: string) => file.length <= MAX_FILE_LENGTH;

// zod 유효성 검사를 위한 schema 선언
export const formSchema = z.object({
  target: z.string(),
  date: z.string().min(1),
  file: z
    .any().optional()
  //   .refine( checkFileLength, "4장까지만 첨부 가능합니다.") 
  //   .refine((files) => !files || Array.from(files).every(file => file.size <= MAX_FILE_SIZE), `Max file size is 20MB.`)
  //   .refine(
  //     (files) =>  !files || Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
  //     ".jpg, .jpeg, .png, .webp 형식의 파일만 업로드 가능합니다."
  // )
  ,
  link: z.string().nullable().optional(),
  content: z.string().refine(str => str.length !== 0, '피드백은 필수입니다.'),
});
// 자동 완성을 위해 type 선언
export type FormType = z.infer<typeof formSchema>;
export type DateSchema = z.infer<typeof dateSchema>;