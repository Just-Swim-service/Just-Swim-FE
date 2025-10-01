'use client';

import { HTMLAttributes, MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormButton, HistoryBackHeader, TextInput, TextArea } from '@components';
import { createCommunity } from '@apis';
import { useErrorHandler } from '@utils';
import { communitySchema, type CommunityFormData } from './schema';

import styled from './styles.module.scss';

function InputWrapper({
  children,
  name,
  required = false,
  ...props
}: {
  children?: React.ReactNode;
  name: string;
  required?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styled.fieldset} {...props}>
      <div className={styled.fieldset_title}>
        <p>{name}</p>
        {required && <span>{'(필수)'}</span>}
      </div>
      {children}
    </div>
  );
}

export function FormBody() {
  const { handleError } = useErrorHandler();
  const [serverErrors, setServerErrors] = useState<{
    title: string;
    content: string;
    error?: string;
  }>({ title: '', content: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (data: CommunityFormData) => {
    try {
      // 운동 데이터 구성
      const workoutData: any = {};
      if (data.workoutTime) workoutData.workoutTime = `${data.workoutTime}분`;
      if (data.workoutDistance)
        workoutData.workoutDistance = `${data.workoutDistance}m`;
      if (data.workoutIntensity)
        workoutData.workoutIntensity = data.workoutIntensity;

      const response = await createCommunity({
        title: data.title,
        content: data.content,
        workoutData:
          Object.keys(workoutData).length > 0 ? workoutData : undefined,
      });

      if (response) {
        // 성공 시 리다이렉트는 action에서 처리
        window.location.href = '/community';
      }
    } catch (error) {
      handleError(error);
      setServerErrors({
        title: '',
        content: '',
        error: '게시글 작성에 실패했습니다. 다시 시도해주세요.',
      });
    }
  });

  const onValid = async () => {
    await onSubmit();
  };

  const clearTitleError = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setServerErrors((s) => ({
      ...s,
      title: '',
    }));
  };

  const clearContentError = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setServerErrors((s) => ({
      ...s,
      content: '',
    }));
  };

  return (
    <div>
      <HistoryBackHeader title="게시글 작성" />
      <main>
        <section className={styled.container}>
          <form action={onValid} className={styled.form}>
            <div className={styled.form_body}>
              <div className={styled.upper_container}>
                <InputWrapper
                  name="제목"
                  required={true}
                  onClick={clearTitleError}>
                  <TextInput
                    {...register('title')}
                    placeholder="게시글 제목을 입력해주세요"
                    valid={!errors.title && !serverErrors.title}
                    errorMessage={errors.title?.message || serverErrors.title}
                    maxLength={50}
                  />
                </InputWrapper>
                <InputWrapper
                  name="내용"
                  required={true}
                  onClick={clearContentError}>
                  <TextArea
                    {...register('content')}
                    placeholder="운동 기록이나 경험을 공유해주세요"
                    // @ts-ignore
                    errors={[
                      errors.content?.message || serverErrors.content,
                    ].filter(Boolean)}
                    height={120}
                  />
                </InputWrapper>
              </div>
              <div className={styled.divider} />
              <div className={styled.lower_container}>
                <InputWrapper name="운동 시간 (선택사항)">
                  <input
                    {...register('workoutTime')}
                    className={styled.workout_input}
                    placeholder="30"
                    type="number"
                    min="1"
                    max="999"
                  />
                  <span className={styled.input_unit}>분</span>
                </InputWrapper>
                <InputWrapper name="운동 거리 (선택사항)">
                  <input
                    {...register('workoutDistance')}
                    className={styled.workout_input}
                    placeholder="1000"
                    type="number"
                    min="1"
                    max="99999"
                  />
                  <span className={styled.input_unit}>m</span>
                </InputWrapper>
                <InputWrapper name="운동 강도 (선택사항)">
                  <select
                    {...register('workoutIntensity')}
                    className={styled.workout_select}>
                    <option value="">선택해주세요</option>
                    <option value="낮음">낮음</option>
                    <option value="보통">보통</option>
                    <option value="높음">높음</option>
                  </select>
                </InputWrapper>
              </div>
            </div>
            <div className={styled.button_container}>
              <FormButton
                text="게시하기"
                active={isValid && !serverErrors.title && !serverErrors.content}
              />
            </div>
          </form>
          {(serverErrors.title ||
            serverErrors.content ||
            serverErrors.error) && (
            <div className={styled.error_container}>
              {serverErrors.title && (
                <div className={styled.error_message}>
                  <p>{serverErrors.title}</p>
                </div>
              )}
              {serverErrors.content && (
                <div className={styled.error_message}>
                  <p>{serverErrors.content}</p>
                </div>
              )}
              {serverErrors.error && (
                <div className={styled.error_message}>
                  <p>{serverErrors.error}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
