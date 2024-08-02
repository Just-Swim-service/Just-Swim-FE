'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { IconKakao } from '@assets';
import { IconNaver } from '@assets';
import { IconGoogle } from '@assets';
import { HTTP_STATUS, TEXT, USER_TYPE } from '@data';
import { Provider } from '@types';
import { getTokenInCookies, handleSignUp } from '@/(beforeLogin)/_utils';
import { getMyProfile } from '@/_apis/users.ts';
import { ROUTES } from '@/_data/routes';
import { useUserStore } from '@store';

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

      setAddUserProfile({ token: authorizationToken, profile: data.data });
      const checkType = getUserType(authorizationToken);
      if (
        checkType === USER_TYPE.INSTRUCTOR ||
        checkType === USER_TYPE.CUSTOMER
      ) {
        return router.replace(ROUTES.SCHEDULE.root);
      }
      return router.replace(ROUTES.ONBOARDING.type);
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
