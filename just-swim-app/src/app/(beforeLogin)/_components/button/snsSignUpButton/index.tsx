'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { IconKakao } from '@assets';
import { IconNaver } from '@assets';
import { IconGoogle } from '@assets';
import { HTTP_STATUS, OnBoardingType, TEXT, USER_TYPE } from '@data';
import { Provider } from '@types';
import { getTokenInCookies, handleSignUp } from '@/(beforeLogin)/_utils';
import { getMyProfile, postUserLogin } from '@/_apis/users.ts';
import { useUserStore } from '@/(beforeLogin)/signup/type/page';
import { stat } from 'fs';

const SNS_ICONS = {
  google: IconGoogle,
  kakao: IconKakao,
  naver: IconNaver,
} as const;

export function SNSSignInButton({ sns }: { sns: Provider }) {
  const router = useRouter();
  const { setAddUserProfile, setAddUserToken } = useUserStore();
  const Icon = SNS_ICONS[sns];

  const handleOnboarding = async () => {
    const authorizationToken = await getTokenInCookies();

    if (authorizationToken) {
      const { status, data } = await getMyProfile();

      // 브라우저 쿠키에는 있는데, 디비에 데이터가 없는 경우임 -> 재가입 필요 / 토큰 설정도 다시 해야함.
      if (status === HTTP_STATUS.NOT_ACCEPTABLE) {
        setAddUserToken('');
        return router.replace('/signin');
      }

      setAddUserProfile({ token: authorizationToken, profile: data });
      const checkType = data?.userType;
      if (
        checkType === USER_TYPE.INSTRUCTOR ||
        checkType === USER_TYPE.CUSTOMER
      ) {
        return router.replace('/schedule');
      }
      return router.replace('/signup/type');
    }

    const redirectURL = await handleSignUp(sns);
    return router.push(redirectURL!);
  };

  return (
    <div className={styles.button_wrapper}>
      <button
        onClick={handleOnboarding}
        className={`${styles[`${sns}_button`]}`}>
        <div>
          <Icon className={styles.sns_image} />
          <p>{TEXT.SIGNUP_PAGE.provider[sns]}</p>
        </div>
      </button>
    </div>
  );
}
