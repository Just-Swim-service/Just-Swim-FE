'use client';

import { BottomNav, ProfileHeader } from '@components';

import Search from './_components/search/page';
import ClassView from './_components/classView/page';

export default function classList() {
  const data = {
    name: '강사',
    image: '',
  };

  return (
    <>
      <ProfileHeader leftContent="수업 정보" data={data} />
      <Search />
      <ClassView />
      <BottomNav />
    </>
  );
}
