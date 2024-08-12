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
        let map = new Map();

        // console.log(data);
        // feedbackId가 같다면 피드백 정보가 담긴 obj를 배열로 담아준다.
        data.forEach((el) => {
          if (!map.has(el.feedbackId)) {
            map.set(el.feedbackId, [el]);
          } else {
            let existingArray = map.get(el.feedbackId);
            // existingArray.push(el);
            map.set(el.feedbackId, existingArray);
          }
        });
        // console.log(map.values());
        // setFeedbackList(data);
        let arrayFromMap = Array.from(map.values());
        setFeedbackList(arrayFromMap);
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
          <div key={item[0].feedbackId} className={styled.feedbackList_Card}>
            <div>
              <p className={styled.target}>
                <span>
                  <MaskGroup />
                  {/* {console.log(item)} */}
                </span>
                {`${item[0].memberNickname} 님외 ${item.length}명에게`}
              </p>
            </div>
            <p className={styled.content}>{item[0].feedbackContent}</p>
            <div>
              <p>
                <span className={styled.icon}>
                  <Calendar />
                </span>
                {item[0].feedbackDate}
              </p>
              <p>
                <span className={styled.icon}>
                  <UserTypeIndividual />
                </span>
                {item[0].feedbackType}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
