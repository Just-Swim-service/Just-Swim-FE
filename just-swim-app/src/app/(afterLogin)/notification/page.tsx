import React from 'react';
import { Metadata } from 'next';
import { NotificationPage } from './NotificationPage';
import { getNotifications, getNotificationStats } from '@apis';

export const metadata: Metadata = {
  title: '알림 - Just Swim',
  description: '수영 강의 알림을 확인하세요.',
};

export default async function Page() {
  try {
    // 초기 데이터 로드
    const [initialNotifications, stats] = await Promise.all([
      getNotifications({ page: 1, pageSize: 10 }),
      getNotificationStats(),
    ]);

    return (
      <NotificationPage
        initialNotifications={initialNotifications}
        initialStats={stats}
      />
    );
  } catch (error) {
    console.error('알림 페이지 초기화 실패:', error);
    return <NotificationPage />;
  }
}
