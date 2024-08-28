'use client';

import React, { useState } from 'react';
import styles from './pages.module.scss';

import { IconGallery, IconInputValid } from '@assets';
import { LogoutModal, URLImage } from '@components';
import { ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { removeTokenInCookies } from '@utils';
import { useRouter } from 'next/navigation';
import { deleteUser } from '@apis';

export default function Deletion() {
  const router = useRouter();
  const { getUserName, getToken, getUserImage, setResetUser } = useUserStore();
  const [showDeletionModal, setShowDeletionModal] = useState(false);

  const setUserDeletion = async () => {
    await deleteUser();
    removeTokenInCookies();
    setResetUser();
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleDeletion = () => {
    setShowDeletionModal(true);
  };

  return (
    <>
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}></div>
          <label htmlFor="select_image" className={styles.image_button}></label>
        </div>
        <div>
          <button onClick={handleDeletion}>확인</button>
        </div>
      </div>
      {showDeletionModal && (
        <LogoutModal
          showModal={showDeletionModal}
          setShowModal={setShowDeletionModal}
          setUserLogout={setUserDeletion}
        />
      )}
    </>
  );
}
