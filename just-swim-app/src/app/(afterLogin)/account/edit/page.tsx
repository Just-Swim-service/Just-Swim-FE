'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconGallery, IconInputValid } from '@assets';

import { useLayoutEffect, useState } from 'react';
import { ROUTES } from '@/_data/routes';
import { useUserStore } from '@store';
import { useURLImage } from '@utils';
import { patchUserEdit } from '@/_apis/users.ts';
import { HTTP_STATUS } from '@data';
import { TextInput } from '@components';

export default function Account() {
  const router = useRouter();

  const { URLImage } = useURLImage();
  const { getUserName, getToken, getUserImage, setAddUserProfile } =
    useUserStore();
  const userToken = getToken();
  const initUserName = getUserName(userToken);
  const initUserImage = getUserImage(userToken);
  const [editable, setEditable] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');

  useLayoutEffect(() => {
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

  const handleBackPage = () => {
    router.back();
  };

  return (
    <>
      <div className={styles.account_header}>
        <div className={styles.content}>
          <div className={styles.back_link} onClick={handleBackPage}>
            <IconArrowLeft width={20} height={20} fill="#ff0000" />
            <p>프로필</p>
          </div>
          <div
            className={`${styles.edit_link} ${editable ? styles.abled : styles.disabled}`}>
            <div onClick={handleEditProfile}>완료</div>
          </div>
        </div>
      </div>
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage
              imageURL={profileImage}
              alt="profile image"
              width={100}
              height={100}
            />
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
          <p className={styles.name_title}>이름</p>
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
