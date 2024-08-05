'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconGallery } from '@assets';

import { useLayoutEffect, useState } from 'react';
import { ROUTES } from '@/_data/routes';
import { useUserStore } from '@store';
import { useURLImage } from '@utils';
import { patchUserEdit } from '@/_apis/users.ts';
import { HTTP_STATUS } from '@data';
import { ConfirmButton, ProfileHeader, TextInput } from '@components';

export default function Account() {
  const router = useRouter();

  const { URLImage } = useURLImage();
  const { getUserName, getToken, getUserImage, setAddUserProfile } =
    useUserStore();
  const userToken = getToken();
  const [editable, setEditable] = useState<{ state: boolean; text: string }>({
    state: false,
    text: '수정하기',
  });
  const [userName, setUserName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  console.log('profileImage', profileImage);

  useLayoutEffect(() => {
    if (!userToken) {
      router.push(ROUTES.ONBOARDING.signin);
    } else {
      setUserName(getUserName(userToken));
      setProfileImage(getUserImage(userToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditable = () => {
    if (editable.state) {
      setEditable({ state: false, text: '수정하기' });
    } else {
      setEditable({ state: true, text: '완료하기' });
    }
  };

  const handleEditProfile = async () => {
    const { status } = await patchUserEdit({
      profileImage: profileImage,
      name: userName,
    });

    if (status === HTTP_STATUS.OK) {
      setAddUserProfile({
        token: userToken,
        profile: {
          name: userName,
          profileImage: profileImage,
        },
      });
    }
  };

  const handleUserName = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(evt.target.value);
  };

  const handleProfileImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = evt.target.files?.[0];

    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
    }
  };

  const handleLogOut = () => {
    // TODO: 로그아웃 로직
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleAccountDeletion = () => {
    router.push(ROUTES.ACCOUNT.deletion);
  };

  return (
    <>
      <div className={styles.account_header}></div>
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
          {!editable.state && (
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
          )}
        </div>
        <div className={styles.name_input_wrapper}>
          <p className={styles.name_title}>이름</p>
          <input
            type="text"
            value={userName}
            onChange={handleUserName}
            className={styles.name_input}
          />
        </div>
      </div>
      {!editable.state && (
        <div className={styles.account_footer}>
          <ConfirmButton text="로그아웃" kind="cancel" />
          <ConfirmButton text="회원 탈퇴" kind="cancel-sub" border={true} />
        </div>
      )}
    </>
  );
}
