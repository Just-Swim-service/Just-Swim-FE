import styled from './feedbackList.module.scss';
import MaskGroup from '@assets/mask_group.svg';
import Calendar from '@assets/calendar.svg';
import UserTypeIndividual from '@assets/user_type_individual.svg';
import { randomId } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/feedback`
console.log(URL)

async function getFeedback() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const response = await fetch(URL,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  return json;
}

export async function FeedbackList() {
  let feedbackList = await getFeedback()
  console.log(feedbackList)
  // let feedbackList = [
  //   {
  //     date: '3월 12일',
  //     type: '개별 피드백',
  //     content:
  //       '회원님! 오늘 자세는 좋았으나 마지막 스퍼트가 부족해 보였어요 호흡하실 때에도 팔 각도를 조정해 주시면...',
  //     target: 'User 1122 님',
  //   },
  //   {
  //     date: '3월 10일',
  //     type: '개별 피드백',
  //     content: '오늘 진행한 그룹 수업 영상 보내드립니다~',
  //     target: 'User 1122 님 외 3명',
  //   },
  //   {
  //     date: '3월 8일',
  //     type: '단체 피드백',
  //     content:
  //       '센터 휴강으로 인해 3월 9일 수업은 휴강 임을 다시 한번 알려드립니다. 모두 미세먼지 조심하시고 3월 13일날 ...',
  //     target: '아티스틱 스윔 개별 코치 반 전체',
  //   },
  //   {
  //     date: '3월 8일',
  //     type: '단체 피드백',
  //     content:
  //       '센터 휴강으로 인해 3월 9일 수업은 휴강 임을 다시 한번 알려드립니다. 모두 미세먼지 조심하시고 3월 13일날 ...',
  //     target: '아티스틱 스윔 개별 코치 반 전체',
  //   },
  //   {
  //     date: '3월 8일',
  //     type: '단체 피드백',
  //     content:
  //       '센터 휴강으로 인해 3월 9일 수업은 휴강 임을 다시 한번 알려드립니다. 모두 미세먼지 조심하시고 3월 13일날 ...',
  //     target: '아티스틱 스윔 개별 코치 반 전체',
  //   },
  // ];

  return (
    <div className={styled.feedbackList_box}>
      <div className={styled.feedbackList_text}>
        <p className={styled.prev}>이전 기록</p>
        <p>시간 순으로 수강생에게 남긴 기록을 확인할 수 있습니다.</p>
      </div>
      <div>
        {feedbackList.map((item) => (
          <div key={randomId()} className={styled.feedbackList_Card}>
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
