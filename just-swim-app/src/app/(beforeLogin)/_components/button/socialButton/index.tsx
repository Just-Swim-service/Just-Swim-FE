'use client';

import { NextApiRequest } from 'next';
import styles from './styles.module.scss';
import { getUserSignUp } from '@apis';
import { useRouter } from 'next/navigation';

export function SNSSignUpButton({ sns }: { sns: string }) {
  const router = useRouter();

  const handleSignUp = async () => {
    const signUpUrl = await getUserSignUp(sns);
    console.log('redirectUrl in client: ', signUpUrl);
    if (signUpUrl) {
      // zustand 에 저장
      router.push(signUpUrl);
    } else {
      // 처리 필요
    }
  };

  return (
    <div className={styles.button_wrapper}>
      <button onClick={handleSignUp} className={`${styles[sns + '_button']}`}>
        {/* <div>
          {IconComponent && <IconComponent className={styles.sns_image} />}{' '}
          <p>{sns}로 계속하기</p>
        </div> */}
      </button>
    </div>
  );
}
// Response {
//     status: 200,
//     statusText: 'OK',
//     headers: Headers {
//       date: 'Sat, 29 Jun 2024 07:01:00 GMT',
//       'content-type': 'application/json',
//       'transfer-encoding': 'chunked',
//       connection: 'keep-alive',
//       kakao: 'Talk',
//       server: 'nginx',
//       'strict-transport-security': 'max-age=31536000',
//       'x-xss-protection': '1; mode=block',
//       'x-content-type-options': 'nosniff',
//       'content-security-policy': "default-src 'self' *.kakao.com *.kakao.co.kr *.kakaocdn.net *.daum.net *.daumcdn.net *.melon.co.kr *.melon.com *.google.com *.gstatic.com aem-collector.daumkakao.io aem-ingest.onkakao.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.kakao.com *.kakao.co.kr *.kakaocdn.net *.daum.net *.daumcdn.net *.google.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.kakao.com *.kakao.co.kr *.kakaocdn.net *.daum.net *.daumcdn.net *.google.com *.gstatic.com; frame-src *; font-src *; report-uri /reports/csp",
//       'accept-ch': 'Sec-CH-UA-Model,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Platform-Version',
//       'content-encoding': 'gzip'
//     },
//     body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
//     bodyUsed: false,
//     ok: true,
//     redirected: true,
//     type: 'cors',
//     url: 'https://accounts.kakao.com/login?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fresponse_type%3Dcode%26redirect_uri%3Dhttp%253A%252F%252F3.38.162.80%252Fapi%252FOauth%252Fkakao%252Fcallback%26through_account%3Dtrue%26client_id%3Dc37358eccaf180a0f8ce086c7bd58766'
//   }
