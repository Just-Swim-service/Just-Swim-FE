"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const routeChooseType = () => {
    router.replace('/login/type');
  };

  const onClickGoogle = () => {
    console.log('구글 로그인');
    routeChooseType();
  };
  const onClickNaver = () => {
    console.log('네이버 로그인');
    routeChooseType();
  };
  const onClickKakao = () => {
    console.log('Kakao 로그인');
    routeChooseType();
  };

  return (
    <div>
      <h1 onClick={onClickGoogle}>구글 로그인</h1>
      <h1 onClick={onClickNaver}>네이버 로그인</h1>
      <h1 onClick={onClickKakao}>카카오톡 로그인</h1>
    </div>
  );
}
