'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useNotificationStore } from '../../../_store/notification';
import { notificationApi } from '../../../_apis/notification';
import NotificationItem from '../notificationItem';
import styles from './styles.module.scss';

const NotificationModal: React.FC = () => {
  const {
    isModalOpen,
    setModalOpen,
    notifications,
    setNotifications,
    isLoading,
    setLoading,
    markAllAsRead,
    unreadCount,
  } = useNotificationStore();

  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 알림 목록 조회
  useEffect(() => {
    if (isModalOpen) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isModalOpen, setModalOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getNotifications({ limit: 20 });
      const list = (response as any)?.notifications ?? [];
      console.log('Fetched notifications:', list);
      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('알림을 불러오지 못했습니다.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      // 전역 store에 반영
      markAllAsRead();
      // UI 동기화 위해 목록 갱신(선택)
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      setError('모두 읽음 처리에 실패했습니다.');
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.overlay} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="알림"
        ref={modalRef}>
        <div className={styles.header}>
          <h3 className={styles.title}>알림</h3>
          <div className={styles.headerActions}>
            {unreadCount > 0 && (
              <button
                className={styles.markAllReadButton}
                onClick={handleMarkAllAsRead}
                aria-label="모두 읽음 처리">
                모두 읽음
              </button>
            )}
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="새로고침"
              title="새로고침">
              {isLoading ? '⟳' : '↻'}
            </button>
            <button
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
              aria-label="닫기"
              title="닫기">
              ✕
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>알림을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔔</div>
              <p>알림이 없습니다</p>
            </div>
          ) : (
            <div className={styles.notificationList}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
