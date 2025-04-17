'use client';

import Image from 'next/image';
import styled from './styles.module.scss';
import { useRouter } from 'next/navigation';
import { FeedbackProps } from '@types';
import {
  IconCalendar,
  IconDefaultProfile,
  IconGroup,
  IconIndividual,
} from '@assets';

// TODO _components 폴더 내부나 페이지 폴더 내부 _components 폴더로 이동
export function FeedbackCard({ feedback }: { feedback: FeedbackProps }) {
  const selectedMember = feedback.members?.[0] ?? null;
  const router = useRouter();

  const goToFeedbackDetail = (feedbackId: string) => {
    if (feedbackId) {
      router.push(`/feedback/feedbackDetail/${feedbackId}`);
    }
  };

  return (
    <div
      className={styled.feedback_item}
      onClick={() => goToFeedbackDetail(feedback.feedbackId)}>
      <div className={styled.header}>
        <div className={styled.image_wrapper}>
          {selectedMember?.memberProfileImage ? (
            <Image
              src={selectedMember.memberProfileImage}
              alt={`${selectedMember.memberName} 프로필 이미지`}
              width={22}
              height={22}
            />
          ) : (
            <IconDefaultProfile width={22} height={22} />
          )}
        </div>
        <div className={styled.feedback_to}>
          {feedback.feedbackType === 'group' ? (
            <p>
              <span>{feedback.lectureTitle || '선택된 수업이 없습니다.'}</span>
              <span>{' 전체에게'}</span>
            </p>
          ) : (
            <p>
              <span>
                {!!selectedMember
                  ? `${selectedMember.memberName}님`
                  : '선택된 사용자가 없습니다.'}
              </span>
              <span>{`${feedback.members.length > 1 ? ` 외 ${feedback.members.length - 1}명` : ''}`}</span>
              <span>에게</span>
            </p>
          )}
        </div>
      </div>
      <div className={styled.content}>
        <p>{feedback.feedbackContent}</p>
      </div>
      <div className={styled.info}>
        <div className={styled.date_wrapper}>
          <IconCalendar width={16} height={16} />
          <p>{`${parseInt(feedback.feedbackDate.split('.')[1])}월 ${parseInt(feedback.feedbackDate.split('.')[2])}일`}</p>
        </div>
        <div className={styled.target_wrapper}>
          {feedback.feedbackType === 'group' ? (
            <IconGroup width={16} height={16} />
          ) : (
            <IconIndividual width={16} height={16} />
          )}
          <p>{`${feedback.feedbackType === 'group' ? '단체 피드백' : '개인 피드백'}`}</p>
        </div>
      </div>
    </div>
  );
}
