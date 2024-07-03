'use client';

import styles from './button.module.scss';
import { useRouter } from 'next/navigation';
import { IconKakao } from '@assets';
import { IconNaver } from '@assets';
import { IconGoogle } from '@assets';
import { TEXT } from '@data';
import { Provider } from '@types';
import { userSignUp } from '@/(beforeLogin)/_utils';

const SNS_ICONS = {
  google: IconGoogle,
  kakao: IconKakao,
  naver: IconNaver,
} as const;

export function SNSSignUpButton({ sns }: { sns: Provider }) {
  const router = useRouter();
  const Icon = SNS_ICONS[sns];

  const handleSignUp = async () => {
    const signUpUrl = await userSignUp(sns);

    if (signUpUrl) {
      router.push(signUpUrl);
    } else {
      // 처리 필요
    }
  };

  return (
    <div className={styles.button_wrapper}>
      <button onClick={handleSignUp} className={`${styles[`${sns}_button`]}`}>
        <div>
          <Icon className={styles.sns_image} />
          <p>{TEXT.SIGNUP_PAGE.provider[sns]}</p>
        </div>
      </button>
    </div>
  );
}
