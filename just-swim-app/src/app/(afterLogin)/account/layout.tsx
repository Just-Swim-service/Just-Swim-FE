'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.scss';

import { IconArrowLeft } from '@assets';
import React, { useState, SetStateAction } from 'react';
import { patchUserEdit } from '@apis';
import { HTTP_STATUS } from '@data';
import { useUserStore } from '@store';

type ContextProps = {
  userToken: string;
  editable: boolean;
  userName: string;
  profileImage: string;
  setEditable: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
  setProfileImage: React.Dispatch<SetStateAction<string>>;
};

export const AccountContext = React.createContext<ContextProps>({
  userToken: '',
  editable: false,
  userName: '',
  profileImage: '',
  setEditable: () => {},
  setUserName: () => {},
  setProfileImage: () => {},
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const param = usePathname();

  const { getToken, setAddUserProfile } = useUserStore();
  const userToken = getToken();
  const [editable, setEditable] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

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
              {param === '/account'
                ? '내 정보'
                : '/account/edit'
                  ? '프로필 수정'
                  : ''}
            </p>
          </div>
          {param === '/account/edit' ? (
            <div
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}>
              <div onClick={handleEditProfile}>완료</div>
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
      </AccountContext.Provider>
    </div>
  );
}
