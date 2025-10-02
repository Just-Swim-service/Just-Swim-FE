'use client';

import { HTMLAttributes, MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { HistoryBackHeader, TextInput } from '@components';
import { createCommunity } from '@apis';
import { useErrorHandler } from '@utils';
import { communitySchema, type CommunityFormData } from './schema';
import { IntensityInput } from '../intensityInput';

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
      console.log('Form data:', data); // 디버깅용

      // 운동 데이터 구성
      const workoutData: any = {};
      if (data.workoutTime) workoutData.workoutTime = `${data.workoutTime}분`;
      if (data.workoutDistance)
        workoutData.workoutDistance = `${data.workoutDistance}m`;
      if (data.workoutIntensity)
        workoutData.workoutIntensity = data.workoutIntensity;

      const requestData = {
        title: data.title,
        content: data.content,
        workoutData:
          Object.keys(workoutData).length > 0 ? workoutData : undefined,
      };

      console.log('Request data:', requestData); // 디버깅용

      const response = await createCommunity(requestData);
      console.log('API response:', response); // 디버깅용

      // 성공 시 리다이렉트
      console.log('Community created successfully:', response);
      window.location.href = '/community';
    } catch (error) {
      console.error('Create community error:', error); // 디버깅용
      handleError(error);
      setServerErrors({
        title: '',
        content: '',
        error: '게시글 작성에 실패했습니다. 다시 시도해주세요.',
      });
    }
  });

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
          <form onSubmit={onSubmit} className={styled.form}>
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
                  <TextInput
                    {...register('content')}
                    placeholder="운동 기록이나 경험을 공유해주세요"
                    valid={!errors.content && !serverErrors.content}
                    errorMessage={
                      errors.content?.message || serverErrors.content
                    }
                    maxLength={1000}
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
                  <IntensityInput
                    {...register('workoutIntensity')}
                    placeholder="선택해주세요"
                  />
                </InputWrapper>
              </div>
            </div>
            <div className={styled.button_container}>
              <button
                type="submit"
                disabled={
                  !isValid || !!serverErrors.title || !!serverErrors.content
                }
                className={styled.submit_button}>
                게시하기
              </button>
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
