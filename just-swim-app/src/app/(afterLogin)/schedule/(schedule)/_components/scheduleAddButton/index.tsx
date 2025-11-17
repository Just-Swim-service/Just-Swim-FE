'use client';

import styled from './styles.module.scss';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { IconAdd, IconQRScan, IconArrowLeft } from '@assets';
import { getMyProfile, getLecturePreview } from '@apis';
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
      // URL 파싱 시도
      let url: URL;
      try {
        url = new URL(scannedValue);
      } catch (error) {
        alert('❌ 유효하지 않은 QR 코드 형식입니다.');
        return;
      }

      const token = url.searchParams.get('token');
      const lectureId = url.searchParams.get('lectureId');

      // 토큰이 있으면 토큰 방식, 없으면 기존 lectureId 방식 (하위 호환성)
      if (!token && !lectureId) {
        alert('❌ QR 코드에 유효한 토큰 또는 강의 ID가 없습니다.');
        return;
      }

      // 1단계: 강의 정보 미리보기
      let lectureInfo;
      if (token) {
        // 토큰 방식
        lectureInfo = await getLecturePreview(token, true);
      } else {
        // 기존 lectureId 방식
        lectureInfo = await getLecturePreview(parseInt(lectureId!));
      }
      
      if (!lectureInfo) {
        alert('❌ 강의 정보를 불러올 수 없습니다.');
        return;
      }

      // 2단계: 사용자에게 확인받기
      const confirmed = confirm(
        `📚 수업 정보\n\n` +
        `제목: ${lectureInfo.lectureTitle}\n` +
        `강사: ${lectureInfo.instructorName}\n` +
        `시간: ${lectureInfo.lectureTime}\n` +
        `요일: ${lectureInfo.lectureDays}\n` +
        `장소: ${lectureInfo.lectureLocation}\n\n` +
        `이 수업에 등록하시겠습니까?`
      );

      if (!confirmed) {
        return;
      }

      // 3단계: 수업 등록
      if (token) {
        // 토큰 방식
        await fetchJson(`/member/qr-code?token=${encodeURIComponent(token)}`);
      } else {
        // 기존 lectureId 방식
        await fetchJson(`/member/qr-code?lectureId=${lectureId}`);
      }

      alert('✅ 수업 등록 완료! 스케줄로 이동합니다.');
      router.push('/schedule');
    } catch (error: any) {
      console.error('QR 코드 처리 중 오류:', error);

      if (error?.status === 409) {
        alert('⚠️ 이미 등록된 수업입니다.');
      } else if (error?.status === 400) {
        alert('❌ 삭제되었거나 종료된 강의입니다.');
      } else if (error?.status === 401) {
        alert('❌ 유효하지 않거나 만료된 QR 코드입니다.');
      } else if (error?.status === 404) {
        alert('❌ 존재하지 않는 강의입니다.');
      } else if (error?.status === 403) {
        alert('❌ 수업 등록 권한이 없습니다.');
      } else {
        alert(`❌ 수업 등록에 실패했습니다.\n${error.message || '알 수 없는 오류'}`);
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
