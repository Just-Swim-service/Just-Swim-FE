'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { IconKakao } from '@assets';
import { IconNaver } from '@assets';
import { IconGoogle } from '@assets';
import { OnBoardingType, TEXT } from '@data';
import { Provider } from '@types';
import { handleSignIn } from '@/(beforeLogin)/_utils';

const SNS_ICONS = {
  google: IconGoogle,
  kakao: IconKakao,
  naver: IconNaver,
} as const;

export function SNSSignInButton({ sns }: { sns: Provider }) {
  const router = useRouter();
  const Icon = SNS_ICONS[sns];

  const handleOnboarding = async () => {
    const redirectURL = await handleSignIn(sns);

    if (redirectURL?.data === OnBoardingType.SIGNIN) {
      router.replace(redirectURL.url);
    } else if (redirectURL?.data === OnBoardingType.SIGNUP) {
      router.push(redirectURL.url);
    }
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
