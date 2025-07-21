'use client';

import React, { useEffect, useState } from 'react';
import styled from './feedbackWrite.module.scss';

import {
  Header,
  DateInput,
  FileInput,
  TextArea,
  SelectPersonInput,
  LinkInput,
} from '@components';

import { IconCalendar } from '@assets';
import { getClassList, getFeedbackPresignedURL } from '@apis';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormType, formSchema } from '@/_schema/index';
import { useRouter } from 'next/navigation';
import { feedbackStore } from '@/_store/feedback';
import { searchUserStore } from '@store';
import { StoredFileInfo } from '@types';

interface CustomFormData {
  date: string;
  files?: StoredFileInfo[];
  targets?: string;
  link: string | null | undefined;
  content: string;
}

export default function FeedbackWrite() {
  const router = useRouter();
  const { setFeedbackFormData, resetFeedbackFormData, getFeedbackFormData } =
    feedbackStore();
  const { resetMemberData } = searchUserStore();
  const [members, setMembers] = useState<any>();

  const initialFeedbackDataRaw = getFeedbackFormData();

  const initialFeedbackData = {
    ...initialFeedbackDataRaw,
    files:
      initialFeedbackDataRaw?.files?.length > 0
        ? initialFeedbackDataRaw.files
        : [],
  };

  // 수강생 리스트 초기 로딩
  useEffect(() => {
    const getMembersData = async () => {
      const data = await getClassList().then((res) => res.data);
      if (data.success) {
        const memberData: any = data.data.flatMap((d: any) =>
          d.members.map((member: any) => ({
            ...member,
            lectureTitle: d.lectureTitle,
          })),
        );
        setMembers(memberData);
      }
    };
    getMembersData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      target: initialFeedbackData?.targets ?? '',
      date: initialFeedbackData?.date ?? '',
      file: [],
      link: initialFeedbackData?.link ?? '',
      content: initialFeedbackData?.content ?? '',
    },
  });

  useEffect(() => {
    const subscription = watch((data) => {
      const currentFiles = getFeedbackFormData().files ?? [];

      const formDataObject: CustomFormData = {
        date: data.date ?? '',
        targets: data.target,
        link: data.link,
        content: data.content ?? '',
        files: currentFiles,
      };
      setFeedbackFormData(formDataObject, 'personal');
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: FormType) => {
    const rhfFiles = data.file; // File[]
    const rawFiles = getFeedbackFormData().files ?? [];

    const uploadedFiles = await Promise.all(
      rawFiles.map(async (storedFile: any, idx: number) => {
        const file = rhfFiles[idx];

        const needsUpload =
          !storedFile.fileURL ||
          storedFile.fileURL.startsWith('data:') ||
          storedFile.fileURL.includes('base64') ||
          storedFile.fileURL.startsWith('blob:');

        if (!needsUpload) {
          return {
            filePath: storedFile.fileURL,
            fileType: storedFile.mediaType ?? 'image',
            fileName: storedFile.name ?? '',
            fileSize: storedFile.size ?? 0,
            duration: storedFile.duration?.toString() ?? null,
            thumbnailPath: storedFile.thumbnailPath ?? null,
          };
        }

        if (!file) return null;

        try {
          const [presigned] = await getFeedbackPresignedURL([file.name]);
          const { presignedUrl, contentType } = presigned;

          const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': contentType,
            },
          });

          if (!response.ok) throw new Error('파일 업로드 실패');

          const isVideo = file.type.startsWith('video/');
          let duration: string | undefined = undefined;

          if (isVideo) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            duration = await new Promise((resolve) => {
              video.onloadedmetadata = () => {
                resolve(video.duration.toFixed(1));
                URL.revokeObjectURL(video.src);
              };
              video.onerror = () => resolve(undefined);
            });
          }

          return {
            filePath: presignedUrl.split('?')[0],
            fileType: isVideo ? 'video' : 'image',
            fileName: file.name,
            fileSize: file.size,
            duration: duration ?? null,
            thumbnailPath: storedFile.thumbnailPath ?? null,
          };
        } catch (err) {
          console.error('[업로드 실패]', err);
          return null;
        }
      }),
    );

    const validFiles = uploadedFiles.filter(
      (f): f is NonNullable<typeof f> => !!f,
    );

    setFeedbackFormData(
      {
        ...getFeedbackFormData(),
        date: data.date,
        targets: data.target,
        link: data.link,
        content: data.content,
        files: validFiles,
      },
      'personal',
    );

    router.push('/feedback/create/confirm');
  };

  return (
    <>
      <Header
        title="개별 피드백 작성하기"
        resetFunc1={resetFeedbackFormData}
        resetFunc2={resetMemberData}
        routerBackUrl="/feedback"
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styled.feedback_write}>
        <div className={styled.inner}>
          <div className={styled.select_customer}>
            <div className={styled.title}>
              수강생 선택하기 <span>(필수)</span>
            </div>
            <div className={styled.sub_title}>
              피드백을 남길 수강생의 정보를 확인해주세요
            </div>
            <SelectPersonInput
              {...register('target')}
              setFeedbackFormData={setFeedbackFormData}
              feedbackData={watch()}
              members={members}
              setValue={setValue}
              errors={[errors.target?.message ?? '']}
            />
          </div>
        </div>

        <div className={styled.divider}></div>

        <div className={styled.feedback_write}>
          <div className={styled.feedback_content}>
            <div className={styled.wrap}>
              <div className={styled.title}>
                피드백 기준 수업일 <span>(필수)</span>
              </div>
              <DateInput
                renderIcon={() => <IconCalendar width={14} height={14} />}
                placeholder="수업 일자를 선택해주세요"
                suffix="종료"
                {...register('date')}
                defaultValue={initialFeedbackData.date}
                setFormValue={(value: string) =>
                  setValue('date', value, { shouldValidate: true })
                }
                // @ts-ignore
                errors={[errors.date?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 파일</div>
              <div className={`${styled.sub_title} ${styled.file}`}>
                최대 4개의 100MB 이하 이미지 또는 동영상 파일만 첨부 가능합니다
              </div>
              <FileInput
                feedbackType="personal"
                allowVideo={true}
                accept="image/*,video/*"
                defaultPreviewImages={
                  initialFeedbackData?.files?.length > 0
                    ? initialFeedbackData.files
                        .map((f: any) => f.fileURL)
                        .filter(
                          (url: string | undefined): url is string =>
                            typeof url === 'string' &&
                            url.trim() !== '' &&
                            !url.startsWith('blob:'),
                        )
                    : []
                }
                setValue={setValue}
                {...register('file')}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 링크</div>
              <LinkInput
                placeholder="첨부하고자 하는 URL을 입력해주세요"
                {...register('link')}
                value={initialFeedbackData?.link}
                // @ts-ignore
                errors={[errors.link?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>
                피드백 남기기 <span>(필수)</span>
              </div>
              <TextArea
                placeholder="피드백을 입력해주세요"
                height={100}
                {...register('content')}
                // @ts-ignore
                errors={[errors.content?.message ?? '']}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`${styled.submit_btn} ${!isValid ? styled.disabled : ''}`}
          disabled={!isValid}>
          작성완료
        </button>
      </form>
    </>
  );
}
