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
    if (sns === 'google') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = 'https://api.just-swim.kr/api/Oauth/google/callback';
      const scope = 'openid email profile';

      const googleLoginUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=consent`;

      window.location.href = googleLoginUrl;
      return;
    }

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
