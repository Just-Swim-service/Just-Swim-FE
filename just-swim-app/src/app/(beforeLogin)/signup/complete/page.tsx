'use client';

import styles from './pages.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { URLImage } from '@components';
import { TEXT, ROUTES } from '@data';
import { getCachedMyProfile } from '@apis';
import { ProfileProps } from '@types';

export default function Complete() {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<ProfileProps>();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getCachedMyProfile();
      setUserProfile(response);
    };
    fetchProfileInfo();
  }, []);

  const handleRoute = () => {
    if (!userProfile?.userType) {
      console.log(
        'User의 Type이 없습니다. 로그인 페이지로 돌아갑니다. Code: signup/complete',
      );
      router.push(ROUTES.ONBOARDING.signin);
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
          <URLImage
            imageURL={userProfile?.profileImage as string}
            alt="profile image"
          />
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
