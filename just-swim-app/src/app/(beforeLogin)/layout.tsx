'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './layout.module.scss';
import { FullPageLoader } from '@/_components/common/loading';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const res = await fetch('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const userInfoRes = await fetch('/user/myProfile', {
            method: 'GET',
            credentials: 'include',
          });
          if (userInfoRes.ok) {
            const userInfo = await userInfoRes.json();

            if (userInfo?.data?.userType) {
              setRedirecting(true);
              router.replace('/schedule');
              return;
            } else {
              setRedirecting(true);
              router.replace('/type');
              return;
            }
          }
        } else {
          console.log('❌ Refresh 실패, 로그인 폼 유지');
        }
      } catch (err) {
        console.error('Silent Refresh 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRefreshToken();
  }, [router]);

  if (loading) return <FullPageLoader />;

  if (redirecting) return null;

  return <div className={styles.before_login_container}>{children}</div>;
}
