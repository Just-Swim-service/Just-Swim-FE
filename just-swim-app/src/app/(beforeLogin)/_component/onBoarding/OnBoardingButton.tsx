import './onBoarding.scss';

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
  const imgSrc: string =
    name === 'kakao' ? Kakao : name === 'naver' ? Naver : Google;

  return (
    <div className="button_wrapper">
      <button onClick={onClick} className={`${name}_button`}>
        <div>
          <Image
            className="sns_image"
            src={imgSrc}
            alt={`${name}`}
          />
          <p>{sns}로 계속하기</p>
        </div>
      </button>
    </div>
  );
}
