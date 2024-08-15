'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { HTTP_STATUS, TEXT, USER_TYPE, ROUTES } from '@data';
import { IconKakao, IconNaver, IconGoogle } from '@assets';
import { getMyProfile, getSignUp } from '@apis';
import { getTokenInCookies } from '@utils';
import { useUserStore } from '@store';
import { Provider } from '@types';

const SNS_ICONS = {
  google: IconGoogle,
  kakao: IconKakao,
  naver: IconNaver,
} as const;

export function SNSSignInButton({ sns }: { sns: Provider }) {
  const router = useRouter();
  const { setAddUserProfile, setAddUserToken, getUserType } = useUserStore();
  const Icon = SNS_ICONS[sns];

  const handleOnboarding = async () => {
    const authorizationToken = await getTokenInCookies();

    if (authorizationToken) {
      const { status, data } = await getMyProfile();

      if (status === HTTP_STATUS.NOT_ACCEPTABLE) {
        setAddUserToken('');
        return router.replace(ROUTES.ONBOARDING.signin);
      }

      setAddUserProfile({ token: authorizationToken, profile: data?.data });
      const checkType = getUserType(authorizationToken);
      if (
        checkType === USER_TYPE.INSTRUCTOR ||
        checkType === USER_TYPE.CUSTOMER
      ) {
        return router.replace(ROUTES.SCHEDULE.root);
      }
      return router.replace(ROUTES.ONBOARDING.type);
    }

    const redirectURL = await getSignUp(sns);
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
