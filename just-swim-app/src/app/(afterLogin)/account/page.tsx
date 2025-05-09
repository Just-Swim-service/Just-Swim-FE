'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconSetting } from '@assets';

import { useEffect, useState } from 'react';
import { ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { URLImage, LogoutModal, ProfileInfo } from '@components';
import Link from 'next/link';
import { getMyProfile, postUserLogout, revalidateMyProfile } from '@apis';
import { removeTokenInCookies } from '@utils';

export default function Account() {
  const router = useRouter();
  const { setResetUser } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getMyProfile();
      setProfileInfo(response.data.data as ProfileInfo);
    };
    fetchProfileInfo();
  }, []);

  const setUserLogout = async () => {
    await postUserLogout();
    await revalidateMyProfile();
    removeTokenInCookies();
    setResetUser();
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleProfileEdit = () => {
    router.push(ROUTES.ACCOUNT.edit);
  };

  const handleManageAccount = () => {
    // TODO: 계정/정보 관리 로직
  };

  const handlePolicyApp = () => {
    // TODO: 약관 및 운영정책 로직
  };

  const handleSendOpinion = () => {
    // TODO: 의견 보내기 로직
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleLogOut = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <div className={styles.account_profile}>
        <div className={styles.account_image_wrapper}>
          <div className={styles.account_img}>
            <URLImage
              imageURL={profileInfo?.profileImage || ''}
              alt="profile image"
            />
          </div>
          <div suppressHydrationWarning>{profileInfo?.name}</div>
        </div>
        <button
          className={styles.account_change_profile}
          onClick={handleProfileEdit}>
          {TEXT.ACCOUNT_PAGE.editInfo}
        </button>
      </div>
      <div className={styles.account_setting}>
        <div className={styles.account_setting_title}>
          <IconSetting />
          <div>{TEXT.ACCOUNT_PAGE.appSetting}</div>
        </div>
        {/* 디자인 정해지면 구현 예정 */}
        <div className={styles.app_setting}>
          <Link
            className={styles.app_setting_menu}
            href={ROUTES.ONBOARDING.root}>
            <span>계정 / 정보 관리</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link>
          <Link
            className={styles.app_setting_menu}
            href={ROUTES.ONBOARDING.root}>
            <span>약관 및 운영정책</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link>
          <Link
            className={styles.app_setting_menu}
            href={ROUTES.ONBOARDING.root}>
            <span>의견 보내기</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link>
        </div>
        <div className={styles.app_version}>
          <div>
            <div>버전 정보</div>
            <span>최신버전: 1.1.0</span>
          </div>
          <span>1.1.0</span>
        </div>
        <div className={styles.account_action}>
          <div className={styles.account_action_menu} onClick={handleLogOut}>
            {TEXT.ACCOUNT_PAGE.logout}
          </div>
          <div className={styles.account_action_menu}>
            <Link className={styles.deletion} href={'/account/deletion'}>
              {TEXT.ACCOUNT_PAGE.deletion}
            </Link>
          </div>
        </div>
      </div>
      {showLogoutModal && (
        <LogoutModal
          showModal={showLogoutModal}
          setShowModal={setShowLogoutModal}
          setUserLogout={setUserLogout}
        />
      )}
    </>
  );
}
