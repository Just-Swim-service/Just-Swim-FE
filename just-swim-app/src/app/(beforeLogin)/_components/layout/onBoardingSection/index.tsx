'use client';

import { useRouter } from 'next/navigation';

import { OnBoardingButton } from '../../button';
import { snsLoginEventHandler } from '../../../_utils';

import styles from './styles.module.scss';

export async function OnBoardingSection() {
  const router = useRouter();
  const { onClickGoogle, onClickNaver, onClickKakao } =await 
    snsLoginEventHandler(router);
  return (
    <>
      <div className={styles.section}>
        <OnBoardingButton name="google" sns="구글" onClick={onClickGoogle} />
        <OnBoardingButton name="google" sns="Apple ID" onClick={onClickGoogle} />
        <OnBoardingButton name="kakao" sns="카카오" onClick={onClickKakao} />
        <OnBoardingButton name="naver" sns="네이버" onClick={onClickNaver} />
      </div>
    </>
  );
}
