'use client';

import styles from './OnBoarding.module.css';
import OnBoardingButton from './OnBoardingButton';
import { snsLoginEventHandler } from '../../_function/snsLoginEventHandler';
import { useRouter } from 'next/navigation';

export default function OnBoardingSection() {
  const router = useRouter();
  const { onClickGoogle, onClickNaver, onClickKakao } =
    snsLoginEventHandler(router);
  return (
    <>
      <div className={styles.section}>
        <OnBoardingButton name='kakao' sns='카카오' onClick={onClickKakao} />
        <OnBoardingButton name='naver' sns='네이버' onClick={onClickNaver} />
        <OnBoardingButton name='google' sns='구글' onClick={onClickGoogle} />
      </div>
    </>
  );
}
