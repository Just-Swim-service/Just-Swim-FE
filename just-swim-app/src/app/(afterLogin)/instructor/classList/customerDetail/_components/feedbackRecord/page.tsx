import styles from './feedbackRecord.module.css';

export default function FeedbackRecord() {
  return (
    <table className={styles.feedbackRecord}>
      <tr>
        <td className={styles.day}>2023년 1월 12일 수업</td>
        <td className={styles.type}>개별 피드백</td>
      </tr>
      <tr>
        <td className={styles.content}>
          회원님! 오늘 자세는 아주 좋았으나 마지막 스퍼트가 부족해 보였어요.
          호흡하실 때 지난 시간에 말씀드린 것처럼 하시면 더 좋을 것 같습니다.
          관련 영상 링크 첨부해 드리니 꼭 다음 시간 전까지 시청하고 오세요!
          오늘도 수고하셨습니다.
        </td>
        <td className={styles.photo}>+3장</td>
      </tr>
      <tr>
        <td className={styles.link} colSpan={2}>
          https://www.notion.so/4-73697ca598274d27beb4
        </td>
      </tr>
    </table>
  );
}
