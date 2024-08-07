'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@assets';

import { useLayoutEffect } from 'react';
import { ROUTES } from '@/_data/routes';
import { useUserStore } from '@store';
import { useURLImage } from '@utils';
import { ConfirmButton } from '@components';
import Link from 'next/link';

export default function Account() {
  const router = useRouter();

  const { URLImage } = useURLImage();
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

  const handleBackPage = () => {
    router.back();
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
      <div className={styles.account_header}>
        <div className={styles.content}>
          <div className={styles.back_link} onClick={handleBackPage}>
            <IconArrowLeft width={20} height={20} fill="#ff0000" />
            <p>프로필</p>
          </div>
          <div className={styles.edit_link}>
            <Link href={`/account/edit`}>변경하기</Link>
          </div>
        </div>
      </div>
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
        </div>
        <div className={styles.name_input_wrapper}>
          <p className={styles.name_title}>이름</p>
          <input type="text" value={userName} className={styles.name_input} />
        </div>
      </div>
      <div className={styles.account_footer}>
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
      </div>
    </>
  );
}
