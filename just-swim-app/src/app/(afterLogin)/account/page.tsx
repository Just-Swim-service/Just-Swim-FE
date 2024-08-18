'use client';

import styles from './pages.module.scss';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { IconArrowLeft } from '@assets';

import { useLayoutEffect } from 'react';
import { ROUTES } from '@data';
import { useUserStore } from '@store';
import { ConfirmButton, URLImage } from '@components';

export default function Account() {
  const router = useRouter();

  const { getUserName, getToken, getUserImage } = useUserStore();
  const userToken = getToken();
  const userName = getUserName(userToken);
  const userImage = getUserImage(userToken);

  useLayoutEffect(() => {
    if (!userToken) {
      router.push(ROUTES.ONBOARDING.signin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileEdit = () => {
    router.push(ROUTES.ACCOUNT.edit);
  };

  const handleAccountDeletion = () => {
    router.push(ROUTES.ACCOUNT.deletion);
  };

  const handleLogOut = () => {
    // TODO: 로그아웃 로직
    router.replace(ROUTES.ONBOARDING.root);
  };

  return (
    <>
      {/* <div className={styles.account_header}>
        <div className={styles.content}>
          <div className={styles.back_link} onClick={handleBackPage}>
            <IconArrowLeft width={20} height={20} fill="#ff0000" />
            <p>프로필</p>
          </div>
        </div>
      </div> */}
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage
              imageURL={userImage}
              alt="profile image"
              width={100}
              height={100}
            />
          </div>
          <div>홍길동</div>
        </div>
        <button onClick={handleProfileEdit}>프로필 수정하기</button>
      </div>
      {/* <div className={styles.account_footer}>
        <ConfirmButton
          text="로그아웃"
          kind="cancel"
          onClick={handleAccountDeletion}
        />
        <ConfirmButton
          text="회원 탈퇴"
          kind="cancel-sub"
          border={true}
          onClick={handleLogOut}
        />
      </div> */}
    </>
  );
}
