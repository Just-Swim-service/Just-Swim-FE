'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IconAdd, IconQRScan } from '@assets';
import { getMyProfile } from '@apis';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'lodash';
import { Html5Qrcode } from 'html5-qrcode';
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
  const qrRef = useRef<Html5Qrcode | null>(null);

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
    const startScanner = async () => {
      const qrRegionId = 'qr-reader';
      const scanner = new Html5Qrcode(qrRegionId);
      qrRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            console.log('✅ QR 인식됨:', decodedText);
            scanner.stop().then(() => handleQrScan(decodedText));
          },
          (errorMessage) => {
            console.log('❌ QR 인식 실패:', errorMessage); // 빈번하게 호출되니 확인만
          },
        );
      } catch (err) {
        alert('카메라 접근에 실패했습니다. 설정에서 권한을 허용해주세요.');
        setShowScanner(false);
      }
    };

    if (showScanner && profileInfo?.userType === 'customer') {
      setTimeout(() => {
        startScanner(); // DOM 보장 후 실행
      }, 200);
    }

    if (qrRef.current) {
      try {
        qrRef.current.stop();
        qrRef.current.clear();
      } catch (e) {
        console.error('스캐너 정리 중 오류:', e);
      }
    }
  }, [showScanner, profileInfo]);

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

      {showScanner && (
        <div className={styled.fullscreenOverlay}>
          <button
            className={styled.closeButton}
            onClick={() => setShowScanner(false)}>
            ✕
          </button>
          <div id="qr-reader" className={styled.fullscreenScanner} />
        </div>
      )}
    </>
  );
}
