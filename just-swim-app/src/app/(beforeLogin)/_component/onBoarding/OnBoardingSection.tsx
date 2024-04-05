import styles from './OnBoarding.module.css';
import Image from 'next/image';
import Kakao from '@/../public/assets/kakao.svg';
import Naver from '@/../public/assets/naver.svg';
import Google from '@/../public/assets/google.svg';

{
  /* <Image src={LeftBtnSVG} alt="leftBtn" width={35} /> */
}

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
            <div>
              <Image src={Kakao} alt="kakao" />
              <p>카카오로 계속하기</p>
            </div>
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickNaver} className={styles.naverButton}>
            <div>
              <Image src={Naver} alt="naver" />
              <p>네이버로 계속하기</p>
            </div>
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <button onClick={onClickGoogle} className={styles.googleButton}>
            <div>
              <Image src={Google} alt="google" />
              <p>Google로 계속하기</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
