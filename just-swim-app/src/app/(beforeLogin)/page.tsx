'use client';

import { useRouter } from 'next/navigation';
import OnBoardingHeader from './_component/onBoarding/OnBoardingHeader';
import OnBoardingSection from './_component/onBoarding/OnBoardingSection';
import OnBoardingFooter from './_component/onBoarding/OnBoardingFooter';

export default function Home() {
  const router = useRouter();
  const type = '';

  // 로컬스토리지 또는 쿠키 확인해서 이미 존재한다면 바로 페이지 이동하기
  const checkCookie = () => {
    console.log('쿠키 또는 로컬스토리지 확인');

    // 쿠키에 접근하여 타입 확인
    if (type) {
      console.log('타입 존재');
      return true;
    } else {
      console.log('타입 없음');
      return false;
    }
  };

  const routeChooseType = () => {
    router.replace('/login/type');
  };

  const onClickGoogle = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('구글 로그인');
      routeChooseType();
    }
  };

  const onClickNaver = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('네이버 로그인');
      routeChooseType();
    }
  };

  const onClickKakao = () => {
    if (checkCookie()) {
      router.replace(`/${type}`);
    } else {
      console.log('카카오 로그인');
      routeChooseType();
    }
  };

  return (
    <>
      <OnBoardingHeader />
      <OnBoardingSection
        onClickKakao={onClickKakao}
        onClickGoogle={onClickGoogle}
        onClickNaver={onClickNaver}
      />
      <OnBoardingFooter />
    </>
  );
}
