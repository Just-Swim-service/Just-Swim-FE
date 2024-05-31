'use client';

import './onBoarding.scss';
import OnBoardingButton from './OnBoardingButton';
import { snsLoginEventHandler } from '../../_function/snsLoginEventHandler';
import { useRouter } from 'next/navigation';

export default function OnBoardingSection() {
  const router = useRouter();
  const { onClickGoogle, onClickNaver, onClickKakao } =
    snsLoginEventHandler(router);
  return (
    <>
      <section>
        <OnBoardingButton name="google" sns="구글" onClick={onClickGoogle} />
        <OnBoardingButton name="google" sns="Apple ID" onClick={onClickGoogle} />
        <OnBoardingButton name="kakao" sns="카카오" onClick={onClickKakao} />
        <OnBoardingButton name="naver" sns="네이버" onClick={onClickNaver} />
      </section>
    </>
  );
}
