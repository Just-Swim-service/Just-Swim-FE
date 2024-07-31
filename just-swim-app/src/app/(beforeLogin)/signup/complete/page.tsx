'use client';

import { useRouter } from 'next/navigation';
import styles from './pages.module.scss';
import Image, { ImageLoaderProps } from 'next/image';
import { TEXT } from '@data';
import { useUserStore } from '../type/page';
import { useLayoutEffect, useState } from 'react';
import { ROUTES } from '@/_data/routes';

// TODO: myLoader 를 공통으로 빼서 사용하도록 수정
const myLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${src}?w=${width}&q=${quality}`;
};

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
          <Image
            loader={myLoader}
            src={userImage as string}
            alt="profile image"
            width={125}
            height={125}
            priority
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
