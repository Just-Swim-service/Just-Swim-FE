'use client';

import React, { useEffect } from 'react';
import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';

import { IconGallery, IconInputValid } from '@assets';
import { URLImage } from '@components';
import { ROUTES, TEXT } from '@data';
import { AccountContext } from '../_context/context';
import { getMyProfile, getProfilePresignedURL, editProfile } from '@apis';
import { useUserStore } from '@store';

export default function Account() {
  const router = useRouter();
  const { updateProfileAfterEdit } = useUserStore();

  const accountContextData = React.useContext(AccountContext);
  const {
    editable,
    userName,
    profileImage,
    setEditable,
    setUserName,
    setProfileImage,
  } = accountContextData;

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getMyProfile();
        const profile = data.data.data;
        setUserName(profile.name);
        setProfileImage({ fileURL: profile.profileImage });
      } catch (error) {
        router.push(ROUTES.ONBOARDING.signin);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(evt.target.value);
    handleSetEditableTrue();
  };

  const handleProfileImage = async (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = evt.target.files?.[0];
    const presignedURL = await getProfilePresignedURL(file?.name as string);
    if (!presignedURL) {
      throw new Error('Presigned URL을 가져오지 못했습니다.');
    }

    const response = await fetch(presignedURL as any, {
      method: 'PUT',
      body: file,
      headers: file?.type
        ? {
            'Content-Type': file.type,
          }
        : undefined,
    });
    if (!response.ok) {
      throw new Error('파일 업로드 실패');
    }

    const imageData = {
      fileURL: presignedURL.toString().split('?')[0], // URL에서 쿼리스트링 제거
      fileName: file?.name,
      fileType: file?.type,
    };

    setProfileImage(imageData as any); // 타입 강제 캐스팅 불필요
    handleSetEditableTrue();
  };

  const handleSetEditableTrue = () => {
    if (!editable) {
      setEditable(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('🔔 [ProfileEdit] 프로필 저장 시작');
      const updateData: any = {};

      if (userName) {
        updateData.name = userName;
      }

      if (profileImage?.fileURL) {
        updateData.profileImage = profileImage.fileURL;
      }

      const result = await editProfile(updateData);

      if (result.ok) {
        // useUserStore 업데이트
        updateProfileAfterEdit(updateData);

        // 성공 시 편집 모드 해제
        setEditable(false);
        // 페이지 새로고침 또는 성공 메시지 표시
        alert('프로필이 성공적으로 수정되었습니다.');
        router.push('/account');
      } else {
        console.error('🔔 [ProfileEdit] 프로필 저장 실패');
        alert('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('🔔 [ProfileEdit] 프로필 저장 에러:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className={styles.account_section}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage
              imageURL={profileImage.fileURL ?? ''}
              alt="profile image"
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
        {editable && (
          <div className={styles.save_button_wrapper}>
            <button className={styles.save_button} onClick={handleSaveProfile}>
              저장하기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
