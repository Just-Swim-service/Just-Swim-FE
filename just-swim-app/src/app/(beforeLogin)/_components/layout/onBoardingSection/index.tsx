// 'use client';

import { useRouter } from 'next/navigation';

import { OnBoardingButton } from '../../button';
import { snsLoginEventHandler } from '../../../_utils';

import styles from './styles.module.scss';

export function OnBoardingSection() {
  //   const router = useRouter();
  //   const { onClickGoogle, onClickNaver, onClickKakao } =
  //     snsLoginEventHandler(router);
  const api_path = process.env.API_PATH;
  //   console.log(api_path);

  const getData = async () => {
    const res = await fetch('http://3.38.162.80/api/lecture/schedule');

    if (!res.ok) {
      console.log(`실패, ${res}`);
    }
    return res.json();
  };

  getData().then((data) => {
    console.log(data);
  });

  return (
    <>
      <div className={styles.section}>
        {/* <OnBoardingButton name="google" sns="구글" onClick={onClickTest} /> */}
        {/* <OnBoardingButton name="google" sns="구글" onClick={onClickGoogle} /> */}
        {/* <OnBoardingButton name="kakao" sns="카카오" onClick={onClickKakao} />
        <OnBoardingButton name="naver" sns="네이버" onClick={onClickNaver} /> */}
      </div>
    </>
  );
}
