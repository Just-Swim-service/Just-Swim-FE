'use client';

import styles from './pages.module.scss';
import { useRouter } from 'next/navigation';
import { IconArrowRight, IconSetting } from '@assets';

import { useEffect, useState } from 'react';
import { EXTERNAL_LINKS, ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { URLImage, LogoutModal, ProfileInfo } from '@components';
import Link from 'next/link';
import { getMyProfile, postUserLogout, revalidateMyProfile } from '@apis';
import { removeTokenInCookies, removeTokenInCookiesClient } from '@utils';

export default function Account() {
  const router = useRouter();
  const { setResetUser, profileInfo, loadProfileInfo } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadProfileInfo();
  }, [loadProfileInfo]);

  const setUserLogout = async () => {
    try {
      // 1. 백엔드 로그아웃 API 호출
      await postUserLogout();

      // 2. 프로필 캐시 무효화
      await revalidateMyProfile();

      // 3. 쿠키 삭제 (서버사이드와 클라이언트사이드 모두)
      removeTokenInCookies(); // 서버 사이드 쿠키 삭제
      removeTokenInCookiesClient(); // 클라이언트 사이드 쿠키 삭제

      // 4. 사용자 상태 초기화
      setResetUser();

      // 5. 로그인 페이지로 리다이렉트
      router.replace(ROUTES.ONBOARDING.root);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      // 오류가 발생해도 로컬 상태는 초기화
      removeTokenInCookies();
      removeTokenInCookiesClient();
      setResetUser();
      router.replace(ROUTES.ONBOARDING.root);
    }
  };

  const handleProfileEdit = () => {
    // router.push 대신 Link 컴포넌트 사용 권장
    // router.push(ROUTES.ACCOUNT.edit);
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
          <Link href={ROUTES.ACCOUNT.edit} className={styles.edit_link}>
            {TEXT.ACCOUNT_PAGE.editInfo}
          </Link>
        </button>
      </div>
      <div className={styles.account_setting}>
        <div className={styles.account_setting_title}>
          <IconSetting />
          <div>{TEXT.ACCOUNT_PAGE.appSetting}</div>
        </div>
        {/* 디자인 정해지면 구현 예정 */}
        <div className={styles.app_setting}>
          {/* <Link
            className={styles.app_setting_menu}
            href={ROUTES.ONBOARDING.root}>
            <span>계정 / 정보 관리</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link> */}
          <Link
            className={styles.app_setting_menu}
            href={EXTERNAL_LINKS.POLICY_AND_TERMS}>
            <span>약관 및 운영정책</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link>
          {/* <Link
            className={styles.app_setting_menu}
            href={ROUTES.ONBOARDING.root}>
            <span>의견 보내기</span>
            <IconArrowRight width={12} height={12} fill="#000000" />
          </Link> */}
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
