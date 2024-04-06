import styles from './OnBoarding.module.css';
import Image from 'next/image';
import Kakao from '@/../public/assets/kakao.svg';
import Naver from '@/../public/assets/naver.svg';
import Google from '@/../public/assets/google.svg';

export default function OnBoardingButton({
  name,
  sns,
  onClick,
}: {
  name: string;
  sns: string;
  onClick: () => void;
}) {
  const imgSrc: string =
    name === 'kakao' ? Kakao : name === 'naver' ? Naver : Google;

  return (
    <div className={styles.buttonWrapper}>
      <button onClick={onClick} className={`${styles[name + 'Button']}`}>
        <div>
          <Image
            className={styles.snsImage}
            src={imgSrc}
            alt={`${name}`}
            // width={100}
            // height={100}
          />
          <p>{sns}로 계속하기</p>
        </div>
      </button>
    </div>
  );
}
