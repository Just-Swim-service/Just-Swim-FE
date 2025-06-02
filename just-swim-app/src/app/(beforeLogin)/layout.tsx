'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const res = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          console.log('✅ Refresh 성공, /schedule 이동');
          router.replace('/schedule');
        } else {
          console.log('❌ Refresh 실패, 로그인 폼 유지');
        }
      } catch (err) {
        console.error('Silent Refresh 에러:', err);
      }
    };

    checkRefreshToken();
  }, [router]);

  return <div className={styles.before_login_container}>{children}</div>;
}
