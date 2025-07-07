'use client';

import React, { useEffect, useRef, useState } from 'react';

import styled from './feedbackWrite.module.scss';

import { Header, DateInput, FileInput, LinkInput, TextArea } from '@components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormType } from '@/_schema';
import { SelectClassInput } from '@/_components/form/input/selectClassInput';
import { IconCalendar } from '@assets';
import { useRouter } from 'next/navigation';
import { feedbackStore } from '@/_store/feedback';
import { getClassList, getFeedbackPresignedURL } from '@apis';
import { searchClassStore } from '@store';
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
  const { resetClassData } = searchClassStore();
  const [lectures, setLectures] = useState<any>();

  const initialFeedbackDataRaw = getFeedbackFormData();

  const initialFeedbackData = {
    ...initialFeedbackDataRaw,
    files:
      initialFeedbackDataRaw?.files?.length > 0
        ? initialFeedbackDataRaw.files
        : [],
  };

  useEffect(() => {
    const getLecturesData = async () => {
      const data = await getClassList();
      if (data.data) {
        const lectureTime = data.lectureTime ? data.lectureTime.split('-') : [];
        setLectures({ ...data.data, lectureTime });
      }
    };
    getLecturesData();
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
      const formDataObject: CustomFormData = {
        date: data.date ?? '',
        targets: data.target,
        link: data.link,
        content: data.content ?? '',
        files:
          data.file?.map((file: any) => {
            return {
              name: file.name,
              size: file.size,
              fileURL: '',
              origin: file,
            };
          }) ?? [],
      };
      setFeedbackFormData(formDataObject, 'group');
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      fileURL: '',
      origin: file,
    }));

    setValue(
      'file',
      newFiles.map((f) => f.origin),
      { shouldValidate: true },
    );

    setFeedbackFormData(
      {
        ...getFeedbackFormData(),
        files: newFiles,
      },
      'group',
    );
  };

  const onSubmit = async (data: FormType) => {
    const prevFiles = getFeedbackFormData().files ?? [];

    const uploadedFiles = await Promise.all(
      prevFiles.map(async (file: any) => {
        if (file.fileURL) return file;

        try {
          const presignedURL = await getFeedbackPresignedURL([file.name]);
          const response = await fetch(presignedURL[0].presignedUrl, {
            method: 'PUT',
            body: file.origin,
            headers: {
              'Content-Type': file.origin.type,
            },
          });

          if (!response.ok) throw new Error('파일 업로드 실패');

          return {
            ...file,
            fileURL: presignedURL[0].presignedUrl.split('?')[0],
          };
        } catch (error) {
          return null;
        }
      }),
    );

    const validFiles = uploadedFiles.filter((f) => f?.fileURL);

    setFeedbackFormData(
      {
        date: data.date,
        targets: data.target,
        link: data.link,
        content: data.content,
        files: validFiles,
      },
      'group',
    );

    return router.push('/feedback/create/confirmClass');
  };

  return (
    <>
      <Header
        title="반별 피드백 작성하기"
        resetFunc1={resetFeedbackFormData}
        resetFunc2={resetClassData}
        routerBackUrl={'/feedback'}
      />
      <form onSubmit={handleSubmit(onSubmit)} className={styled.feedback_write}>
        <div className={styled.inner}>
          <div className={styled.select_customer}>
            <div className={styled.title}>
              수업 선택하기 <span>(필수)</span>
            </div>
            <div className={styled.sub_title}>
              피드백을 남길 수업의 정보를 확인해주세요
            </div>
            <SelectClassInput
              {...register('target')}
              lectures={lectures}
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
                최대 4개의 20MB 이하 이미지 또는 동영상 파일만 첨부 가능합니다
              </div>

              <FileInput
                {...register('file')}
                onChange={handleChange}
                allowVideo={true}
                accept="image/*,video/*"
                defaultPreviewImages={
                  initialFeedbackData?.files?.length > 0
                    ? initialFeedbackData.files.map((f: any) => f.fileURL)
                    : []
                }
                setValue={setValue}
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
