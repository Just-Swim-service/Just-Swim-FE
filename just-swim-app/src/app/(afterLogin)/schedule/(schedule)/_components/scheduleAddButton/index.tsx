'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IconAdd, IconQRScan } from '@assets';
import { getMyProfile } from '@apis';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'lodash';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { fetchJson } from '@utils';

type ProfileInfo = {
  name: string;
  profileImage: string;
  userType: string;
};

export function ScheduleAddButton() {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      const response = await getMyProfile();
      if (isEmpty(response)) {
        return router.replace('/signin');
      }
      setProfileInfo(response.data.data as ProfileInfo);
    };
    fetchProfileInfo();
  }, [router]);

  // QR 스캔 처리 함수
  const handleQrScan = async (scannedValue: string) => {
    try {
      const url = new URL(scannedValue);
      const lectureId = url.searchParams.get('lectureId');

      if (!lectureId) {
        alert('QR 코드에 유효한 lectureId가 없습니다.');
        return;
      }

      await fetchJson(`/api/member/qr-code?lectureId=${lectureId}`, {
        method: 'GET',
      });

      alert('수업 등록 완료! 스케줄로 이동합니다.');
      setShowScanner(false);
      router.push('/schedule');
    } catch (e) {
      console.error('QR 코드 처리 중 오류:', e);
    }
  };

  // QR 스캐너 시작
  useEffect(() => {
    if (showScanner && profileInfo?.userType === 'customer') {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false,
      );

      scanner.render(
        (result) => {
          scanner.clear();
          handleQrScan(result);
        },
        (error) => {
          console.warn('스캔 실패:', error);
        },
      );

      scannerRef.current = scanner;
    }

    return () => {
      scannerRef.current?.clear?.().catch(() => {});
    };
  }, [profileInfo]);

  return (
    <>
      {profileInfo?.userType === 'instructor' && (
        <Link href="/schedule/add" className={styled.link}>
          <IconAdd />
        </Link>
      )}

      {profileInfo?.userType === 'customer' && !showScanner && (
        <button className={styled.link} onClick={() => setShowScanner(true)}>
          <IconQRScan />
        </button>
      )}
    </>
  );
}
