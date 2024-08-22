'use client';

import React, { useEffect } from 'react';
import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';

import { IconGallery, IconInputValid } from '@assets';
import { URLImage } from '@components';
import { useUserStore } from '@store';
import { ROUTES, TEXT } from '@data';

import { AccountContext } from '../layout';

export default function Account() {
  const router = useRouter();

  const accountContextData = React.useContext(AccountContext);
  const {
    userToken,
    editable,
    userName,
    profileImage,
    setEditable,
    setUserName,
    setProfileImage,
  } = accountContextData;
  const { getUserName, getUserImage } = useUserStore();
  const initUserName = getUserName(userToken);
  const initUserImage = getUserImage(userToken);

  useEffect(() => {
    const init = async () => {
      if (!userToken) {
        router.push(ROUTES.ONBOARDING.signin);
      } else {
        await setUserName(initUserName);
        await setProfileImage(initUserImage);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(evt.target.value);
    handleSetEditableTrue();
  };

  const handleProfileImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = evt.target.files?.[0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      handleSetEditableTrue();
    }
  };

  const handleSetEditableTrue = () => {
    if (!editable) {
      setEditable(true);
    }
  };

  return (
    <>
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage imageURL={profileImage} alt="profile image" />
          </div>
          <label htmlFor="select_image" className={styles.image_button}>
            <IconGallery />
            <div>
              <input
                type="file"
                id="select_image"
                accept="image/*"
                onChange={handleProfileImage}
                className={styles.input_file}
              />
            </div>
          </label>
        </div>
        <div className={styles.name_input_wrapper}>
          <p className={styles.name_title}>{TEXT.ACCOUNT_PAGE.name}</p>
          <div className={styles.input_wrapper}>
            <input
              type="text"
              value={userName}
              onChange={handleUserName}
              className={styles.name_input}
            />
            {editable && <IconInputValid width={18} height={18} />}
          </div>
        </div>
      </div>
    </>
  );
}
