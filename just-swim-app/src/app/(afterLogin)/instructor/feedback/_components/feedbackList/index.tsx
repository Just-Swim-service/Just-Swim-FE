'use client';

import styled from './feedbackList.module.scss';
import MaskGroup from '@assets/mask_group.svg';
import Calendar from '@assets/calendar.svg';
import UserTypeIndividual from '@assets/user_type_individual.svg';
import { randomId } from '@utils';
import { getFeedback } from '@apis';
import { useEffect, useState } from 'react';

export async function FeedbackList() {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeedback();
        setFeedbackList(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styled.feedbackList_box}>
      <div className={styled.feedbackList_text}>
        <p className={styled.prev}>이전 기록</p>
        <p className={styled.desc}>
          시간 순으로 수강생에게 남긴 기록을 확인할 수 있습니다.
        </p>
      </div>
      <div>
        {feedbackList.map((item, index) => (
          <div key={index} className={styled.feedbackList_Card}>
            <div>
              <p className={styled.target}>
                <span>
                  <MaskGroup />
                </span>
                {item.target}
              </p>
            </div>
            <p className={styled.content}>{item.feedbackContent}</p>
            <div>
              <p>
                <span className={styled.icon}>
                  <Calendar />
                </span>
                {item.feedbackDate}
              </p>
              <p>
                <span className={styled.icon}>
                  <UserTypeIndividual />
                </span>
                {item.feedbackType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
