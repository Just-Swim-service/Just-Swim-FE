'use client';

import ProfileHeader from '@/app/_component/header/ProfileHeader';
import SearchBox from './_components/searchBox/page';
import TabContent from './_components/tabContent/page';

export default function classListTabs() {
  const data = {
    name: '강사',
    image: '',
  };

  return (
    <>
      <ProfileHeader leftContent="수업 정보" data={data} />
      <SearchBox />
      <TabContent />
    </>
  );
}
