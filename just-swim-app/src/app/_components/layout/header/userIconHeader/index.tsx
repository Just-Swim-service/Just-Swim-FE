'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useUserStore } from '@store';
import NoProfile from '@/_assets/images/no_profile.png';
import { useNotificationStore } from '@/_store/notification';
import NotificationModal from '@/_components/notification/notificationModal/NotificationModal';
import { notificationApi } from '@/_apis/notification';
import IconBell from '@assets/icon_bell.svg';

import styled from './styles.module.scss';
import { useEffect } from 'react';

/**
 * 상위 컴포넌트에서 HistoryBackHeader 대한 className을 직접 설정하지 않도록 주의! (동작하지 않음)
 * @param {string} title header의 title
 * @param {string} image user icon의 url
 */

export interface ProfileInfo {
  name: string;
  profileImage: string;
}

export function UserIconHeader({ title }: { title: string }) {
  const { profileInfo, loadProfileInfo } = useUserStore();
  const { unreadCount, setUnreadCount, setModalOpen, isModalOpen } =
    useNotificationStore();

  useEffect(() => {
    loadProfileInfo();
  }, [loadProfileInfo]);

  // 컴포넌트 마운트 시 읽지 않은 알림 개수 조회
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationApi.getUnreadCount();
        setUnreadCount(response.unreadCount);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
  }, [setUnreadCount]);

  const handleNotificationClick = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      <header className={styled.header}>
        <div className={styled.title_wrapper}>
          <h1>{title}</h1>
        </div>
        <div className={styled.header_actions}>
          <button
            className={styled.notification_button}
            onClick={handleNotificationClick}
            aria-label="알림">
            <IconBell
              width={24}
              height={24}
              fill="currentColor"
              className={styled.bell_icon}
            />
            {unreadCount > 0 && (
              <span className={styled.badge}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          <Link href={`/account`}>
            <div className={styled.profile_image}>
              <Image
                src={profileInfo?.profileImage || NoProfile}
                alt={profileInfo?.name || ''}
                width={34}
                height={34}
                priority
              />
            </div>
          </Link>
        </div>
      </header>
      <NotificationModal />
    </>
  );
}
