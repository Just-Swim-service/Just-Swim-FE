// hyebin => 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { checkCookie } from '@utils';

export async function login() {
  const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/login`;
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    body: JSON.stringify({
      email: 'khv2644511@nate.com',
      provider: 'kakao',
    }),
  });

  const data = await res.json();

  return Response.json(data);
}

export const snsLoginEventHandler = async (router: AppRouterInstance) => {
  const type = '';

  const routeChooseType = () => {
    router.push('/login/type');
  };

  const onClickGoogle = () => {
    if (checkCookie(type)) {
      router.push(`/${type}`);
    } else {
      console.log('구글 로그인');
      routeChooseType();
    }
  };

  const onClickNaver = () => {
    if (checkCookie(type)) {
      router.push(`/${type}`);
    } else {
      console.log('네이버 로그인');
      routeChooseType();
    }
  };

  const onClickKakao = async () => {
    const data = await login();
    console.log(data);

    if (checkCookie(type)) {
      router.replace(`/${type}`);
    } else {
      console.log('카카오 로그인');
      routeChooseType();
    }
  };

  return {
    onClickGoogle,
    onClickNaver,
    onClickKakao,
  };
};
