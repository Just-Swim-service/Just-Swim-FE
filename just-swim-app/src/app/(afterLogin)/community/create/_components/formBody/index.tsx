'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { BottomNav, UserIconHeader } from '@components';
import { createCommunity } from '@apis';
import { useErrorHandler } from '@utils';
import { communitySchema, type CommunityFormData } from './schema';

import styled from './styles.module.scss';

export function FormBody() {
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    mode: 'onChange',
  });

  const watchedContent = watch('content', '');
  const contentLength = watchedContent?.length || 0;

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);

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
        router.push('/community');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styled.container}>
      <UserIconHeader title="게시글 작성" />

      <form onSubmit={handleSubmit(onSubmit)} className={styled.form}>
        <div className={styled.formContent}>
          {/* 제목 입력 */}
          <div className={styled.inputGroup}>
            <label className={styled.label}>
              제목 <span className={styled.required}>*</span>
            </label>
            <input
              {...register('title')}
              className={`${styled.input} ${errors.title ? styled.error : ''}`}
              placeholder="게시글 제목을 입력해주세요"
              maxLength={50}
            />
            {errors.title && (
              <span className={styled.errorMessage}>{errors.title.message}</span>
            )}
          </div>

          {/* 내용 입력 */}
          <div className={styled.inputGroup}>
            <label className={styled.label}>
              내용 <span className={styled.required}>*</span>
            </label>
            <textarea
              {...register('content')}
              className={`${styled.textarea} ${errors.content ? styled.error : ''}`}
              placeholder="운동 기록이나 경험을 공유해주세요"
              rows={6}
              maxLength={1000}
            />
            <div className={styled.textareaFooter}>
              {errors.content && (
                <span className={styled.errorMessage}>
                  {errors.content.message}
                </span>
              )}
              <span className={styled.charCount}>{contentLength}/1000</span>
            </div>
          </div>

          {/* 운동 데이터 입력 */}
          <div className={styled.workoutSection}>
            <h3 className={styled.sectionTitle}>운동 정보 (선택사항)</h3>
            <p className={styled.sectionDescription}>
              운동 기록을 추가하면 더 자세한 정보를 공유할 수 있어요
            </p>

            <div className={styled.workoutGrid}>
              {/* 운동 시간 */}
              <div className={styled.workoutInput}>
                <label className={styled.workoutLabel}>운동 시간</label>
                <div className={styled.inputWithUnit}>
                  <input
                    {...register('workoutTime')}
                    className={`${styled.workoutField} ${errors.workoutTime ? styled.error : ''}`}
                    placeholder="30"
                    type="number"
                    min="1"
                    max="999"
                  />
                  <span className={styled.unit}>분</span>
                </div>
                {errors.workoutTime && (
                  <span className={styled.errorMessage}>
                    {errors.workoutTime.message}
                  </span>
                )}
              </div>

              {/* 운동 거리 */}
              <div className={styled.workoutInput}>
                <label className={styled.workoutLabel}>운동 거리</label>
                <div className={styled.inputWithUnit}>
                  <input
                    {...register('workoutDistance')}
                    className={`${styled.workoutField} ${errors.workoutDistance ? styled.error : ''}`}
                    placeholder="1000"
                    type="number"
                    min="1"
                    max="99999"
                  />
                  <span className={styled.unit}>m</span>
                </div>
                {errors.workoutDistance && (
                  <span className={styled.errorMessage}>
                    {errors.workoutDistance.message}
                  </span>
                )}
              </div>

              {/* 운동 강도 */}
              <div className={styled.workoutInput}>
                <label className={styled.workoutLabel}>운동 강도</label>
                <select
                  {...register('workoutIntensity')}
                  className={`${styled.select} ${errors.workoutIntensity ? styled.error : ''}`}>
                  <option value="">선택해주세요</option>
                  <option value="낮음">낮음</option>
                  <option value="보통">보통</option>
                  <option value="높음">높음</option>
                </select>
                {errors.workoutIntensity && (
                  <span className={styled.errorMessage}>
                    {errors.workoutIntensity.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styled.buttonGroup}>
          <button
            type="button"
            className={styled.cancelButton}
            onClick={handleCancel}
            disabled={isSubmitting}>
            취소
          </button>
          <button
            type="submit"
            className={styled.submitButton}
            disabled={!isValid || isSubmitting}>
            {isSubmitting ? '작성 중...' : '게시하기'}
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}
