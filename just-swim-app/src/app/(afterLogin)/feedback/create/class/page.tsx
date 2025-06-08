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

interface CustomFormData {
  date: string;
  files: File[] | null;
  targets?: string;
  link: string | null | undefined;
  content: string;
}

export default function FeedbackWrite() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const { setFeedbackFormData, resetFeedbackFormData } = feedbackStore();
  const { resetClassData } = searchClassStore();
  const [lectures, setLectures] = useState<any>();
  const [images, setImages] = useState<string[]>([]);

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
    register, // RHF의 상태에 연결
    handleSubmit, // RHF에서 제공하는 함수 & event.preventDefault()를 자동으로 호출
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  // handleSubmit에는 RHF에서 validate된 데이터가 들어간다
  const onSubmit = async (data: FormType) => {
    for (const image of data.file) {
      try {
        const presignedURL = await getFeedbackPresignedURL([image.name]);
        if (!presignedURL) {
          throw new Error('Presigned URL을 가져오지 못했습니다.');
        }
        const response = await fetch(presignedURL[0].presignedUrl, {
          method: 'PUT',
          body: image,
          headers: {
            'Content-Type': image.type, // 올리는 파일의 타입
          },
        });

        if (!response.ok) {
          throw new Error('파일 업로드 실패');
        }
        image.fileURL = presignedURL[0].presignedUrl.split('?')[0];
      } catch (error) {
        return null;
      }
    }

    const formDataObject: CustomFormData = {
      date: data.date,
      targets: data.target,
      link: data.link,
      content: data.content,
      files: data.file,
    };
    setFeedbackFormData(formDataObject, 'group');
    return router.push('/feedback/create/confirmClass');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArray = Array.from(targetFiles);

    [...targetFilesArray].forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result as string;
        const obj = {
          name: file.name,
          dataUrl: result,
          file: file,
        };
        // @ts-ignore
        setImages((prev) => [...prev, obj]);
      };
    });
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
                // @ts-ignore
                errors={[errors.date?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 파일</div>
              <div className={`${styled.sub_title} ${styled.file}`}>
                최대 4개의 20MB 이하 파일만 첨부 가능합니다
              </div>

              <FileInput
                {...register('file')}
                onChange={handleChange}
                // @ts-ignore
                setValue={setValue}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 링크</div>
              <LinkInput
                placeholder="첨부하고자 하는 URL을 입력해주세요"
                {...register('link')}
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
