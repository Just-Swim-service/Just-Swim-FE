import styles from './page.module.scss';
import JustSwimSVG from '@assets/logo.svg';
import kakao from '/public/assets/kakao.svg';
import naver from '/public/assets/naver.svg';
import google from '/public/assets/google.svg';

import { SNSSignUpButton } from '../_components/button/socialButton';
import { SNS, TEXT } from '@/_data/users';

type SNS = keyof typeof SNS;

export interface SNSLoginButtonProps {
  sns: SNS;
}

export default function SignIn() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_logo}>
          <JustSwimSVG
            className={styles.logo}
            role="img"
            aria-label={'just-swim'}
          />
          <h3>{TEXT.SIGNUP_PAGE.welcome}</h3>
        </div>
        <div className={styles.header_info}>
          <p>
            {TEXT.SIGNUP_PAGE.notification.first} <br />{' '}
            {TEXT.SIGNUP_PAGE.notification.second}
          </p>
        </div>
      </div>

      <div className={styles.section}>
        {Object.keys(SNS).map((sns) => {
          return <SNSSignUpButton key={sns} sns={sns} />;
        })}
      </div>

      <div className={styles.footer}>
        <p className={styles.footer_info}>
          {TEXT.SIGNUP_PAGE.helper.first} <br /> {TEXT.SIGNUP_PAGE.helper.second}
        </p>
      </div>
    </>
  );
}
