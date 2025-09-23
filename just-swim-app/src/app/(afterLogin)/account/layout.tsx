'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.scss';

import { IconArrowLeft } from '@assets';
import React, { useEffect, useState } from 'react';
import { patchUserEdit, revalidateMyProfile, getMyProfile } from '@apis';
import { HTTP_STATUS, ROUTES, TEXT } from '@data';
import { ProfileEditCompleteToast } from '@components';
import { AccountContext } from './_context/context';
import { useUserStore } from '@store';
import Cookies from 'js-cookie';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const param = usePathname();
  const { setProfileInfo, invalidateProfile } = useUserStore();

  const [token, setToken] = useState<string | boolean>();
  const [show, setShow] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<{
    fileName?: string | undefined;
    fileType?: string | undefined;
    fileURL?: string | undefined;
  }>({ fileName: undefined, fileType: undefined, fileURL: undefined });

  useEffect(() => {
    const getToken = async () => {
      const token = Cookies.get('authorization');
      setToken(token);
    };
    getToken();
  }, []);

  const showToast = () => {
    setShow(true);
  };

  const unshowToast = () => {
    setShow(false);
  };

  const handleEditProfile = async () => {
    const data = await patchUserEdit({
      profileImage: profileImage.fileURL,
      name: userName,
    });
    if (data.status === HTTP_STATUS.OK) {
      await revalidateMyProfile();

      // 서버에서 최신 프로필 정보를 가져와서 스토어 업데이트
      try {
        const latestProfile = await getMyProfile();
        const profileData = latestProfile.data.data;

        // 로컬 스토리지의 user-store 업데이트
        setProfileInfo(profileData);

        setEditable(false);
        showToast();
        router.replace(ROUTES.ACCOUNT.root);
      } catch (error) {
        console.error('프로필 정보 업데이트 실패:', error);
        // 에러가 발생해도 기본 동작은 수행
        setEditable(false);
        showToast();
        router.replace(ROUTES.ACCOUNT.root);
      }
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
            <IconArrowLeft width={20} height={20} fill="#050606" />
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
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}></div>
          ) : null}
        </div>
      </div>
      <AccountContext.Provider
        value={{
          userToken: token ?? false,
          editable: editable,
          userName: userName,
          profileImage: profileImage ?? {
            fileName: undefined,
            fileType: undefined,
            fileURL: undefined,
          },
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
