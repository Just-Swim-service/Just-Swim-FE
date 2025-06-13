'use client';

import { useEffect, useState } from 'react';
import styles from './layout.module.scss';
import { FullPageLoader } from '@/_components/common/loading';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

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

            if (userInfo?.data?.userType && pathname !== '/schedule') {
              window.location.href = '/schedule';
              return;
            } else if (!userInfo?.data?.userType && pathname !== '/type') {
              window.location.href = '/type';
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
  }, [pathname]);

  if (loading) return <FullPageLoader />;

  return <div className={styles.before_login_container}>{children}</div>;
}
