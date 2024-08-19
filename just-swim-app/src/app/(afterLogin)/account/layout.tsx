'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.scss';

import { IconArrowLeft } from '@assets';
import React, { useState, SetStateAction } from 'react';
import { patchUserEdit } from '@apis';
import { HTTP_STATUS, ROUTES, TEXT } from '@data';
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
              {param === ROUTES.ACCOUNT.root
                ? TEXT.ACCOUNT_PAGE.myInfo
                : ROUTES.ACCOUNT.edit
                  ? TEXT.ACCOUNT_PAGE.editInfoTitle
                  : null}
            </p>
          </div>
          {param === ROUTES.ACCOUNT.edit ? (
            <div
              className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}>
              <div onClick={handleEditProfile}>{TEXT.COMMON.done}</div>
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
