'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.scss';

import { IconArrowLeft } from '@assets';
import React, { useState } from 'react';
import { patchUserEdit } from '@apis';
import { HTTP_STATUS, ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { ProfileEditCompleteToast } from '@components';
import { AccountContext } from './_context/context';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const param = usePathname();
  console.log(param);

  const { getToken, setAddUserProfile } = useUserStore();
  const userToken = getToken();
  const [show, setShow] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

  const showToast = () => {
    setShow(true);
  };

  const unshowToast = () => {
    setShow(false);
  };

  const handleEditProfile = async () => {
    const { status } = await patchUserEdit({
      profileImage: profileImage,
      name: userName,
    });

    if (status === HTTP_STATUS.OK) {
      await setAddUserProfile({
        token: userToken,
        profile: {
          name: userName,
          profileImage: profileImage,
        },
      });
      setEditable(false);
      showToast();
      router.replace(ROUTES.ACCOUNT.root);
    }
  };

  const handleBackPage = () => {
    router.back();
  };

  return (
    <div className={styles.account}>
      <div className={styles.account_header}>
        <div className={styles.content}>
          <div className={styles.back_link} onClick={handleBackPage}>
            <IconArrowLeft width={20} height={20} fill="#ff0000" />
            <p>
              {param === ROUTES.ACCOUNT.root ? TEXT.ACCOUNT_PAGE.myInfo : ''}
              {param === ROUTES.ACCOUNT.edit
                ? TEXT.ACCOUNT_PAGE.editInfoTitle
                : ''}
              {param === '/account/deletion' ? '탈퇴하기' : ''}
            </p>
          </div>
          {param === ROUTES.ACCOUNT.edit ? (
            <div
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}>
              <div onClick={handleEditProfile}>{TEXT.COMMON.done}</div>
            </div>
          ) : null}
          {param === '/account/deletion' ? (
            <div
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}>
              <div>건너뛰기</div>
            </div>
          ) : null}
        </div>
      </div>
      <AccountContext.Provider
        value={{
          userToken: userToken,
          editable: editable,
          userName: userName,
          profileImage: profileImage,
          setEditable: setEditable,
          setUserName: setUserName,
          setProfileImage: setProfileImage,
        }}>
        {children}
        {show && <ProfileEditCompleteToast unshowToast={unshowToast} />}
      </AccountContext.Provider>
    </div>
  );
}
