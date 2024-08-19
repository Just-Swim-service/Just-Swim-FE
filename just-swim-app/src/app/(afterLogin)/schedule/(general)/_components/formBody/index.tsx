'use client';

import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ColorInput, EndDateInput, DayInput, FormButton, HistoryBackHeader, LocationInput, TextInput, TimeInput } from '@components';
import { IconRepeatTime } from '@assets';

import { formAction } from "./action";
import { lectureSchema, LectureType } from "./schema";

import styled from './styles.module.scss';

function InputWrapper({
  children,
  name,
  required = false,
  ...props
}: {
  children?: React.ReactNode,
  name: string,
  required?: boolean,
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styled.fieldset} {...props}>
      <div className={styled.fieldset_title}>
        <p>{name}</p>
        {
          required &&
          <span>{"(필수)"}</span>
        }
      </div>
      {children}
    </div>
  )
}

export function FormBody({
  type = 'add',
  id,
  lecture
}: {
  type?: 'add' | 'modify',
  id?: string,
  lecture?: LectureType
}) {
  const isModify = type === 'modify';
  const [serverErrors, setServerErrors] = useState<{ title: string, duplicate: string }>({ title: '', duplicate: '' });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isValid,
    }
  } = useForm<LectureType>({
    resolver: zodResolver(lectureSchema),
    mode: 'onChange'
  });
  
  const onSubmit = handleSubmit(async (data: LectureType) => {
    console.log(data);

    const formData = new FormData();

    formData.append("apiType", type);

    if (isModify) {
      formData.append("lectureId", id!);
    }

    formData.append("lectureTitle", data.lectureTitle);
    formData.append("lectureContent", data.lectureContent);
    formData.append("lectureTime", data.lectureTime);
    formData.append("lectureDays", data.lectureDays);
    formData.append("lectureLocation", data.lectureLocation);
    formData.append("lectureEndDate", data.lectureEndDate);
    formData.append("lectureColor", data.lectureColor);

    const result = await formAction(formData);

    // @ts-ignore
    // if (result.statusCode === 500) {
    //   setServerErrors(s => ({
    //     ...s,
    //     duplicate: '중복된 일정이 있습니다.',
    //   }));
    // }
    // 서버 측에 문제가 있어 추후에 수정하겠습니다.
  });

  const onValid = async () => {
    await onSubmit();
  }

  const clearTitleError = () => {
    setServerErrors(s => ({
      ...s,
      title: '',
    }));
  }

  const clearDuplicateError = () => {
    setServerErrors(s => ({
      ...s,
      duplicate: '',
    }));
  }
  
  return (
    <div>
      <HistoryBackHeader title={type === 'add' ? '수업 등록하기' : '수업 수정하기'} />
      <main>
        <section>
          <form action={onValid} className={styled.form}>
            <div className={styled.form_body}>
              <div className={styled.upper_container}>
                <InputWrapper name='수업명' required={true} onClick={clearTitleError}>
                  <TextInput 
                    {...register("lectureTitle")}
                    placeholder="수업명을 입력해주세요"
                    valid={!errors.lectureTitle && !serverErrors.title}
                    errorMessage={errors.lectureTitle?.message}
                    maxLength={15}
                    defaultValue={isModify ? lecture?.lectureTitle : ''}
                  />
                </InputWrapper>
                <InputWrapper name='수업 설명' required={true}>
                  <TextInput 
                    {...register("lectureContent")} 
                    placeholder="수업 정보를 입력해주세요" 
                    valid={!errors.lectureContent} 
                    errorMessage={errors.lectureContent?.message} 
                    maxLength={30}
                    defaultValue={isModify ? lecture?.lectureContent : ''}
                  />
                </InputWrapper>
              </div>
              <div className={styled.divider} />
              <div className={styled.lower_container}>
                <InputWrapper name='수업 시간' required={true} onClick={clearDuplicateError}>
                  <TimeInput 
                    {...register("lectureTime")}
                    placeholder="시간 선택"
                    defaultValue={isModify ? lecture?.lectureTime : ''}
                    valid={!errors.lectureTime && !serverErrors.duplicate}
                    errorMessage={errors.lectureTime?.message}
                  />
                </InputWrapper>
                <InputWrapper name='수업 요일' required={true} onClick={clearDuplicateError}>
                  <DayInput 
                    {...register("lectureDays")} 
                    placeholder="수업 요일을 선택해 주세요"
                    defaultValue={isModify ? lecture?.lectureDays : ''}
                    valid={!errors.lectureDays && !serverErrors.duplicate}
                    errorMessage={errors.lectureDays?.message}
                  />
                </InputWrapper>
                <InputWrapper name='수업 위치'>
                  <LocationInput 
                    {...register("lectureLocation")} 
                    placeholder="수업 위치를 선택해 주세요"
                    defalutValue={isModify ? lecture?.lectureLocation : ''}
                    valid={!errors.lectureLocation}
                    errorMessage={errors.lectureLocation?.message}
                  />
                </InputWrapper>
                <InputWrapper name='종료 일자'>
                  <EndDateInput 
                    {...register("lectureEndDate")} 
                    renderIcon={() => <IconRepeatTime width={20} height={20} />} 
                    placeholder="종료일 없이 반복" 
                    suffix="종료"
                    defaultValue={isModify ? lecture?.lectureEndDate : ''}
                  />
                </InputWrapper>
                <InputWrapper name='구분 색'>
                  <ColorInput 
                    {...register("lectureColor")}
                    defaultValue={isModify ? lecture?.lectureColor : ''}
                  />
                </InputWrapper>
              </div>
            </div>
            <div className={styled.button_container}>
              <FormButton text="확인" active={isValid && !serverErrors.duplicate} />
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}