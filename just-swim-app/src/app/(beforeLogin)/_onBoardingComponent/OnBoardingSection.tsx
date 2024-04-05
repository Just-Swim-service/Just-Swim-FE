import styles from './OnBoarding.module.css';

export default function OnBoardingSection({
  onClickKakao,
  onClickNaver,
  onClickGoogle,
}: {
  onClickKakao: () => void;
  onClickNaver: () => void;
  onClickGoogle: () => void;
}) {
  return (
    <>
      {/* TODO: 이미지 넣기 */}
      <div className={styles.section}>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickKakao} className={styles.kakaoButton}>
            카카오로 계속하기
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickNaver} className={styles.naverButton}>
            네이버로 계속하기
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickGoogle} className={styles.googleButton}>
            Google로 계속하기
          </button>
        </div>
      </div>
    </>
  );
}
