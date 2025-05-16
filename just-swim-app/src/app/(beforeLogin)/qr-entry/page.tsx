'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchJson } from '@utils';
import Image from 'next/image';
import styles from './styles.module.scss';
import logo from '@assets/logo.svg';

export default function QrEntryPage() {
  const searchParams = useSearchParams();
  const lectureId = searchParams.get('lectureId');
  const [message, setMessage] = useState('QR 코드 등록 중입니다...');

  useEffect(() => {
    const doRegister = async () => {
      if (!lectureId) {
        alert('잘못된 QR 코드입니다.');
        window.location.href = '/';
        return;
      }

      try {
        await fetchJson(`/member/qr-code?lectureId=${lectureId}`);

        setMessage('등록 완료! 메인으로 이동합니다.');
        setTimeout(() => (window.location.href = '/schedule'), 1500);
      } catch (error) {
        console.error('QR 등록 실패:', error);
        setMessage('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        setTimeout(() => (window.location.href = '/signin'), 1500);
      }
    };

    doRegister();
  }, [lectureId]);

  return (
    <div className={styles.wrapper}>
      <Image src={logo} alt="Just Swim Logo" width={120} height={120} />
      <p>{message}</p>
    </div>
  );
}
