import React from 'react';
import { Metadata } from 'next';
import { NotificationPage } from './NotificationPage';

export const metadata: Metadata = {
  title: '알림 - Just Swim',
  description: '수영 강의 알림을 확인하세요.',
};

export default function Page() {
  return <NotificationPage />;
}
