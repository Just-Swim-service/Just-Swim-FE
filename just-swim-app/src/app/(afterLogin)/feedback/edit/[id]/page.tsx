'use client';

import styled from './feedbackInfoEdit.module.scss';
import { IconCalendar } from '@assets';
import Send from '@assets/send.svg';
import UserTypeIndividual from '@assets/user_type_individual.svg';
import UserTypeGroup from '@assets/user_type_group.svg';
import { IconArrowRightSmall } from '@assets';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@components';
import { FeedbackInfo, Members } from '@/_types/typeFeedback';
import { DateInput, FileInput, LinkInput, TextArea } from '@components';
import { formSchema, FormType } from '@/_schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getFeedbackDetail,
  getFeedbackPresignedURL,
  updateFeedback,
} from '@apis';
import { feedbackStore } from '@/_store/feedback';
import { useModal } from '@hooks';
import { FeedbackTargetListModal } from '../../_components/feedbackTargetListModal';

interface CustomFormData {
  date: string;
  files: File[] | null;
  targets?: string;
  link: string | null | undefined;
  content: string;
}

export default function FeedbackInfoEdit() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const feedbackId = params.id as string;

  // react-hook-form 사용
  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<Members[]>([]);
  const [feedbackCreatedAt, setFeedbackCreatedAt] = useState<string>('');
  const { modal, showModal, hideModal } = useModal();
  const { setFeedbackFormData, getFeedbackFormData } = feedbackStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getFeedbackDetail(feedbackId);

        if (data && data.feedback.length > 0) {
          const feedback = data.feedback[0];
          setFeedback(feedback);
          setFeedbackTarget(data?.feedbackTargetList);

          const formattedDate = new Date(data?.feedback[0]?.feedbackCreatedAt)
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '.');
          setFeedbackCreatedAt(formattedDate);

          reset(
            {
              date: feedback.feedbackDate || '',
              content: feedback.feedbackContent || '',
              link: feedback.feedbackLink || '',
            },
            { keepDirtyValues: true },
          );
        }
      } catch (error) {
        console.error('feedback 상세 정보 가져오던 중 에러 발생', error);
      }
    };
    fetchData();
  }, [feedbackId, reset]);

  const onSubmit = async (data: FormType) => {
    // 파일 업로드 처리
    if (data.file && data.file.length > 0) {
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
              'Content-Type': image.type,
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
    }

    // 폼 데이터 객체 생성
    const formDataObject: CustomFormData = {
      date: data.date,
      link: data.link,
      content: data.content,
      files: data.file,
    };

    setFeedbackFormData(formDataObject, `${feedback?.feedbackType}`);
    setIsModalOpen(true);
  };

  const formDataState = getFeedbackFormData();

  const handleConfirm = async () => {
    try {
      const response = await updateFeedback(formDataState, feedbackId);
      if (response && response.status === 200) {
        setIsModalOpen(false);
        router.push(`/feedback/feedbackDetail/${feedbackId}`);
      } else {
        console.error('Feedback submission failed:', response);
      }
    } catch (error) {
      console.error('Error processing feedback update response:', error);
    }
  };

  return (
    <div>
      <Header title="피드백 수정하기" />

      <form onSubmit={handleSubmit(onSubmit)} className={styled.feedback_write}>
        <div className={styled.feedback_date}>
          <span className={styled.icon}>
            <Send />
          </span>
          <p>{feedbackCreatedAt} 전송된 피드백</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백 대상</p>
        </div>
        <div className={styled.detail_content}>
          <span className={styled.detail_icon}>
            {feedbackTarget.length > 1 ? (
              <UserTypeGroup />
            ) : (
              <UserTypeIndividual />
            )}
          </span>
          <p>
            {feedbackTarget.length > 1
              ? `${feedbackTarget[0]?.memberName} 외 ${feedbackTarget.length - 1} 명`
              : `${feedbackTarget[0]?.memberName}`}
          </p>
          <span onClick={showModal} className={styled.arrow_icon}>
            <IconArrowRightSmall />
          </span>
          {modal && (
            <FeedbackTargetListModal
              feedbackTargetList={feedbackTarget}
              hideModal={hideModal}
            />
          )}
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
                defaultValue={feedback?.feedbackDate}
                // @ts-ignore
                errors={[errors.date?.message ?? '']}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 파일</div>
              <FileInput
                {...register('file')}
                defaultPreviewImages={
                  feedback?.images?.map((img) => img.imagePath) || []
                }
                setValue={setValue}
              />
            </div>

            <div className={styled.wrap}>
              <div className={styled.title}>첨부 링크</div>
              <LinkInput
                placeholder="첨부하고자 하는 URL을 입력해주세요"
                {...register('link')}
                value={feedback?.feedbackLink}
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
          className={`${styled.submit_btn} ${!isValid || !isDirty ? styled.disabled : ''}`}
          disabled={!isValid || !isDirty}>
          작성완료
        </button>

        {isModalOpen && (
          <div className={styled.modal_overlay}>
            <div className={styled.modal_content}>
              <p>피드백을 수정하시겠습니까?</p>
              <span>작성된 내용이 수강생에게 전달됩니다.</span>
              <div className={styled.modal_button_box}>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
                <button onClick={handleConfirm}>확인</button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
