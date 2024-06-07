import styled from './feedbackRecord.module.scss';
import HistoryEdu from '@assets/history_edu.svg';
import Day from '@assets/day.svg';
import AccountBox from '@assets/account_box.svg';
import Link from '@assets/link.svg';

export default function FeedbackRecord() {
  return (
    <>
      <p className={styled.title}>
        <span>
          <HistoryEdu />
        </span>
        피드백 기록
      </p>
      <div className={styled.feed_box}>
        <div className={styled.text_flex}>
          <p className={styled.day}>
            <span>
              <Day />
            </span>
            2023년 1월 12일 수업
          </p>
          <div className={styled.text_line}></div>
          <p className={styled.type}>
            <span>
              <AccountBox />
            </span>
            개별 피드백
          </p>
        </div>
        <div className={styled.feed_content}>
          <p className={styled.content}>
            회원님! 오늘 자세는 아주 좋았으나 마지막 스퍼트가 부족해 보였어요.
            호흡하실 때 지난 시간에 말씀드린 것처럼 하시면 더 좋을 것 같습니다.
            관련 영상 링크 첨부해 드리니 꼭 다음 시간 전까지 시청하고 오세요!
            오늘도 수고하셨습니다.
          </p>
          <div>
            <p className={styled.photo}>
              <div></div>
              +3장
            </p>
          </div>
        </div>
        <p className={styled.feed_link}>
          <span>
            <Link />
          </span>
          https://www.notion.so/4-73697ca598274d27beb4
        </p>
      </div>
      <div className={styled.button_box}>
        <button className={styled.feed_button}>피드벡 남기기</button>
      </div>
    </>
  );
}
