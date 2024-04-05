import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { checkCookie } from './checkCookie';

export const snsLoginEventHandler = (router: AppRouterInstance) => {
  const type = '';

  const routeChooseType = () => {
    router.replace('/login/type');
  };

  const onClickGoogle = () => {
    if (checkCookie(type)) {
      router.replace(`/${type}`);
    } else {
      console.log('구글 로그인');
      routeChooseType();
    }
  };

  const onClickNaver = () => {
    if (checkCookie(type)) {
      router.replace(`/${type}`);
    } else {
      console.log('네이버 로그인');
      routeChooseType();
    }
  };

  const onClickKakao = () => {
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
