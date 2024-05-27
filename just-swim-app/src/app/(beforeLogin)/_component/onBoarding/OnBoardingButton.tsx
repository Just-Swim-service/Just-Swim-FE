import styles from './onBoarding.module.scss';

import Image from 'next/image';
import Kakao from '/public/assets/kakao.svg';
import Naver from '/public/assets/naver.svg';
import Google from '/public/assets/google.svg';

export default function OnBoardingButton({
  name,
  sns,
  onClick,
}: {
  name: string;
  sns: string;
  onClick: () => void;
}) {
  // const imgSrc: string =
  //   name === 'kakao' ? Kakao : name === 'naver' ? Naver : Google;

  let IconComponent;
  switch (name) {
    case 'kakao':
      IconComponent = Kakao;
      break;
    case 'naver':
      IconComponent = Naver;
      break;
    case 'google':
      IconComponent = Google;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className={styles.button_wrapper}>
      <button onClick={onClick} className={`${styles[name + '_button']}`}>
        <div>
          {/* SVG 컴포넌트 출력 */}
          {IconComponent && <IconComponent className={styles.sns_image} />}{' '}
          {/* <Image className="sns_image" src={imgSrc} alt={`${name}`} /> */}
          <p>{sns}로 계속하기</p>
        </div>
      </button>
    </div>
  );
}
