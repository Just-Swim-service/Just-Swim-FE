'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import addIcon from '@assets/add.png';
import profile from '@assets/profile1.png';
import deleteButton from '@assets/delete_button.png';

import styled from './feedbackWrite.module.scss';
import {
  Header,
  DateInput,
  FileInput,
  TextInput,
  TextArea,
  SelectPersonInput,
  LinkInput,
} from '@components';

import { IconCalendar } from '@assets';

// test
// RHF 사용을 위한 커스텀 훅
import { useForm, Controller } from 'react-hook-form';
// RHF에서 zod 사용을 위한 resolver
import { zodResolver } from '@hookform/resolvers/zod';
import { submitForm } from './action';
import { FormType, formSchema } from '@/_schema/index';

import { useRouter } from 'next/navigation';
import { feedbackStore } from '@/_store/feedback';

interface CustomFormData {
  date: string;
  files: File[] | null;
  targets: string;
  link: string | null;
  content: string;
}

///////////////////////////
export default function FeedbackWrite() {
  const { setFeedbackHandler } = feedbackStore();
  const router = useRouter();

  // test
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [feedbackFormData, setFeedbackFormData] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // handleSubmit에는 RHF에서 validate된 데이터가 들어간다
  const onSubmit = handleSubmit(async (data: FormType) => {
    // console.log('images', images);
    const formData = new FormData();

    formData.append('target', data.target);
    formData.append('date', data.date);
    // @ts-ignore
    formData.append('link', data.link);
    formData.append('content', data.content);
    // https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
    Array.from(images).forEach((el, i) => {
      // @ts-ignore
      formData.append('file', el.file);
      // @ts-ignore
      formData.append('fileURL', el.dataUrl);
    });

    // @ts-ignore
    const formDataObject: CustomFormData = {};
    // formData.forEach((value, key) => {
    //   formDataObject[key] = value;
    // });

    formData.forEach((value, key) => {
      // console.log(value, key);
      // File 다중선택시 배열이 아닌, 1개만 들어가는 문제 해결방법,,
      if (key === 'fileURL' || key === 'file') {
        if (Object.hasOwn(formDataObject, key)) {
          // @ts-ignore
          formDataObject[key].push(value);
        } else {
          // @ts-ignore
          formDataObject[key] = [value];
        }
      } else {
        // @ts-ignore
        formDataObject[key] = value;
      }
    });

    setFeedbackHandler(formDataObject, 'personal');

    const errors = await submitForm(formData);

    console.log('errors', errors);
    router.push(`confirm`);
  });

  // @ts-ignore
  const onValid = async (data: CreateState) => {
    const imageurlList: string[] = [];
    // RHF에 의해서 자동으로 호출
    // form이 유효하고 검증된 데이터가 존재하는 경우에만
    await onSubmit();
  };

  ////////////////////////
  const fileRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    console.log('fileRef', fileRef);
    fileRef?.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = (e.target as HTMLInputElement).files as FileList;
    const targetFilesArray = Array.from(targetFiles);
    // const selectedFiles: string[] = targetFilesArray.map((file) => {
    //   console.log(file);
    //   return URL.createObjectURL(file);
    // });
    // 합체!
    // setImages((prev) => prev.concat(selectedFiles));

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
      <Header title="개별 피드백 작성하기" />
      <form action={onValid} className={styled.feedback_write}>
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
              // @ts-ignore
              setValue={setValue}
              errors={[errors.target?.message ?? '']}
            />
          </div>
        </div>

        <div className={styled.divider}></div>

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
        {/* <button disabled={!isValid} className={styled.submit_btn}> */}
        <button className={styled.submit_btn}>전송하기</button>
      </form>
    </>
  );
}
