'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IconAdd, IconQRScan, IconArrowLeft } from '@assets';
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

      const response = await fetchJson(`/member/qr-code?lectureId=${lectureId}`);

      alert('✅ 수업 등록 완료! 스케줄로 이동합니다.');
      router.push('/schedule');
    } catch (error: any) {
      console.error('QR 코드 처리 중 오류:', error);

      if (error?.status === 409) {
        alert('⚠️ 이미 등록된 수업입니다.');
      } else if (error?.status === 403) {
        alert('❌ 수업 등록 권한이 없습니다.');
      } else {
        alert(`❌ 수업 등록에 실패했습니다.\n${error.message}`);
      }
    } finally {
      // 무조건 스캐너 종료
      if (qrRef.current) {
        try {
          await qrRef.current.stop();
          await qrRef.current.clear();
        } catch (e) {
          console.error('스캐너 정리 실패:', e);
        }
      }
      setShowScanner(false);
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
          { fps: 10, aspectRatio: 1.7777778 },
          (decodedText) => {
            console.log('✅ QR 인식됨:', decodedText);
            scanner.stop().then(() => handleQrScan(decodedText));
          },
          (errorMessage) => {
            console.log('❌ QR 인식 실패:', errorMessage);
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
            <IconArrowLeft width={24} height={24} fill="#050606" />
            <span className={styled.closeText}>스캐너 끄기</span>
          </button>
          <div id="qr-reader" className={styled.fullscreenScanner} />
          <p className={styled.scannerText}>QR 코드를 중앙에 맞춰주세요</p>
        </div>
      )}
    </>
  );
}
