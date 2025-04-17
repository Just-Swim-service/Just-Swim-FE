'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { TEXT } from '@data';
import { IconKakao, IconNaver, IconGoogle } from '@assets';
import { getSignUp } from '@apis';
import { Provider } from '@types';

const SNS_ICONS = {
  google: IconGoogle,
  kakao: IconKakao,
  naver: IconNaver,
} as const;

export function SNSSignInButton({ sns }: { sns: Provider }) {
  const router = useRouter();
  const Icon = SNS_ICONS[sns];

  const handleOnboarding = async () => {
    const redirectURL = await getSignUp(sns);
    if (!redirectURL) {
      throw new Error('Failed to get the redirect URL');
    }
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
