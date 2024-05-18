'use client';

import { useState } from 'react';
import './schedule.scss';

import Weekly from '/public/assets/weekly.svg';
import Monthly from '/public/assets/monthly.svg';
import Plus from '/public/assets/plus.svg';
import BottomNavBar from '../_component/BottomNavBar';
import ProfileHeader from '../../../_component/Header/ProfileHeader';
import Link from 'next/link';
// import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState('weekly');
  const data = {
    name: '김재환',
    image: '/assets/profile1.png',
  };
  // TODO: type을 어떻게 받아올지 고민해보기
  // console.log('type', type);
  // const params = usePathname();
  // console.log('params', params);

  return (
    <>
      <div className="schedule_header">
        <ProfileHeader leftContent="" data={data} />
        <div className="today_info">
          {/* 날짜로 데이터 바꿔줘야함 */}
          <p>13일 토요일, 오늘</p>
          <h3>이후 등록된 수업이 없습니다.</h3>
          {/* <div>예정된 수업이 2개 있습니다.</div> */}
        </div>
        <div className="schedule_view_type_tab">
          <div className="type_button_wrapper">
            <Link
              href="/instructor/schedule/weekly/classList"
              className={`type_button ${type === 'weekly' ? 'active' : ''}`}>
              <button onClick={() => setType('weekly')}>
                <Weekly className="tab_img" />
                <h3>주간</h3>
              </button>
            </Link>
            <Link
              href="/instructor/schedule/monthly/classList"
              className={`type_button ${type === 'monthly' ? 'active' : ''}`}>
              <button onClick={() => setType('monthly')}>
                <Monthly className="tab_img" />
                <h3>월간</h3>
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="schedule_section">{children}</div>
      <div className="schedule_footer">
        <BottomNavBar />
        <div className="schedule_add">
          {/* <div className="schedule_add" onClick={}> */}
          <Plus />
        </div>
      </div>
    </>
  );
}
