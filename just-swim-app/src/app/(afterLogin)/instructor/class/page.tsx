'use client';

import { BottomNav, Header } from '@components';

import ClassView from './_components/classView/page';

export default function classList() {
  return (
    <>
      <Header title="수업 정보" />
      <ClassView />
      <BottomNav />
    </>
  );
}
