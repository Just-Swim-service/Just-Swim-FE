'use client';

import styled from './feedbackDetail.module.scss';

import Send from '@assets/send.svg';
import Calendar from '@assets/calendar.svg';
import UserTypeIndividual from '@assets/user_type_individual.svg';

import { EditHeader, FileInput } from '@components';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getFeedbackDetail } from '@apis';
import { FeedbackIndo, FeedbackProps } from '@/_types/typeFeedback';

export default function FeedbackDetail(id: any) {
  const [feedbackInfo, setFeedbackInfo] = useState<FeedbackIndo | []>([]);
  const [feedbackTarget, setFeedbackTarget] = useState([]);
  const feedbackId = id.params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getFeedbackDetail(feedbackId);
        setFeedbackInfo(data?.feedback[0]);
        setFeedbackTarget(data?.feedbackTargetList);
      } catch {}
    };
    fetchData();
  }, []);

  console.log(feedbackInfo);
  console.log(feedbackTarget);

  return (
    <>
      <EditHeader leftContent="피드백 기록 보기" data={{ dataUrl: '/' }} />
      <div className={styled.detail_container}>
        <div className={styled.feedback_date}>
          <span className={styled.icon}>
            <Send />
          </span>
          <p>{'2024.09.09'} 전송된 피드백</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백 기준일</p>
        </div>
        <div className={styled.detail_content}>
          <span className={styled.detail_icon}>
            <Calendar />
          </span>
          {/* @ts-ignore */}
          <p>{feedbackInfo.feedbackDate}</p>
        </div>
        <div className={styled.detail_title}>
          <p>피드백 대상</p>
        </div>
        <div className={styled.detail_content}>
          <span className={styled.detail_icon}>
            <UserTypeIndividual />
          </span>
          {/* <p>User 1122 님</p> */}
          <p>
            {feedbackTarget.length > 0
              ? // @ts-ignore
                `${feedbackTarget[0]?.memberNickname} 외 ${feedbackTarget.length} 명`
              : // @ts-ignore
                `${feedbackTarget[0]?.memberNickname}`}
          </p>
        </div>
        {/* @ts-ignore */}
        {feedbackInfo.images?.length > 0 ? (
          <>
            <div className={styled.detail_title}>
              <p>첨부 파일</p>
            </div>
            <div className={styled.detail_photo}>
              {/* @ts-ignore */}
              {(feedbackInfo.images || []).map((image, index) => {
                console.log('image', image.imagePath);
                return (
                  <div
                    key={index}
                    className={styled.preview_item}
                    style={{
                      backgroundImage: `url(${image.imagePath})`,
                      width: '100px',
                      height: '100px',
                      backgroundSize: 'cover',
                    }}></div>
                );
              })}
              {/* <div className={styled.photo}></div>
              <div className={styled.photo}></div> */}
            </div>
          </>
        ) : (
          ''
        )}
        {}
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
          {/* @ts-ignore */}
          <p>{feedbackInfo.feedbackContent}</p>
        </div>
      </div>
    </>
  );
}
