'use client';

import { useState } from 'react';
import Link from 'next/link';

import styled from './profile.module.scss';

import { EditHeader, LogoutModal } from '@components';

export default function Profile() {
  const [showModal, setShowModal] = useState(false);

  const clickModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <EditHeader leftContent="프로필 설정" data={{ dataUrl: '/' }} />
      <div className={styled.profile_container}>
        <div className={styled.photo}></div>
        <div>
          <p>이름</p>
          <div className={styled.name}>
            <p>Hyogyeong park</p>
          </div>
        </div>
        <div className={styled.button}>
          <button className={styled.log_out} onClick={clickModal}>
            로그아웃
          </button>
          <Link href={'./profile/delete'} className={styled.sign_out}>
            회원탈퇴
          </Link>
        </div>
        {showModal && (
          <LogoutModal showModal={showModal} setShowModal={setShowModal} />
        )}
      </div>
    </>
  );
}
