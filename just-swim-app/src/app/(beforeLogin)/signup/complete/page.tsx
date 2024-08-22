'use client';

import styles from './pages.module.scss';
import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { URLImage } from '@components';
import { useUserStore } from '@store';
import { TEXT, ROUTES } from '@data';

export default function Complete() {
  const router = useRouter();

  const { getUserImage, getToken, getUserType } = useUserStore();
  const userToken = getToken();
  const [userImage, setUserImage] = useState<string>();

  useLayoutEffect(() => {
    if (!userToken) {
      router.push(ROUTES.ONBOARDING.signin);
    } else {
      const image = getUserImage(userToken);
      setUserImage(image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoute = () => {
    const userType = getUserType(userToken);
    if (!userType) {
      return;
    }
    router.push(ROUTES.SCHEDULE.root);
  };

  return (
    <>
      <div className={styles.complete_header}>
        <div>
          <h3>{TEXT.SIGNUP_COMPLETE_PAGE.notification}</h3>
        </div>
      </div>
      <div className={styles.complete_section}>
        <div className={styles.profile_img}>
          <URLImage imageURL={userImage as string} alt="profile image" />
        </div>
      </div>
      <div className={styles.complete_footer}>
        <div className={styles.button_wrapper}>
          <button className={styles.select_button} onClick={handleRoute}>
            {TEXT.COMMON.start}
          </button>
        </div>
      </div>
    </>
  );
}
