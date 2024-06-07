'use client';

import EditHeader from '@/app/_component/header/EditHeader';
import styled from './feedbackDetail.module.scss';
import Send from '../../../../../../public/assets/send.svg';
import Calendar from '../../../../../../public/assets/calendar.svg';
import UserTypeIndividual from '../../../../../../public/assets/user_type_individual.svg';

export default function FeedbackDetail() {
  return (
    <>
      <EditHeader leftContent="피드백 기록 보기" data={{ dataUrl: '/' }} />
      <div className={styled.detail_container}>
        <div className={styled.feedback_date}>
          <span className={styled.icon}>
            <Send />
          </span>
          <p>2024.03.22 전송된 피드백</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백 기준일</p>
        </div>
        <div className={styled.detail_content}>
          <span className={styled.detail_icon}>
            <Calendar />
          </span>
          <p>3월 12일, 2024년</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백 대상</p>
        </div>
        <div className={styled.detail_content}>
          <span className={styled.detail_icon}>
            <UserTypeIndividual />
          </span>
          <p>User 1122 님</p>
        </div>
        <div className={styled.detail_title}>
          <p>첨부 파일</p>
        </div>
        <div className={styled.detail_photo}>
          <div className={styled.photo}></div>
          <div className={styled.photo}></div>
        </div>
        <div className={styled.detail_title}>
          <p>첨부 링크</p>
        </div>
        <div className={styled.detail_content}>
          <p>https://github.com/Just-Swim-service</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백</p>
        </div>
        <div className={styled.detail_content}>
          <p>
            회원님! 오늘 자세는 좋았으나 마지막 스퍼트가 부족해 보였어요 호흡하실
            때에도 팔 각도를 조정해 주시면 좋을 것 같습니다.
          </p>
        </div>
      </div>
    </>
  );
}
