'use client';

import { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { ClipboardItem } from 'clipboard-polyfill';
import * as clipboard from 'clipboard-polyfill';
import saveAs from 'file-saver';

import { IconDownload, IconShare, ImageQRCode } from '@assets';
import { QRInstructorProfileProps, LectureQRCodeProps } from '@types';
import { getQRCode } from '@apis';
import NoProfile from '@/_assets/images/no_profile.png';

import styled from './styles.module.scss';

export function QRCode({
  lectureData,
  instructorData,
  lectureId,
  style,
}: {
  lectureData: LectureQRCodeProps;
  instructorData: QRInstructorProfileProps;
  lectureId: number;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 동적 QR 코드 생성
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!lectureId || lectureId <= 0) {
        // lectureId가 유효하지 않으면 기존 방식 사용
        setQrCodeImage(lectureData.lectureQRCode || null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const qrCode = await getQRCode(lectureId);
        setQrCodeImage(qrCode);
      } catch (error: any) {
        console.error('QR 코드 생성 실패:', error);
        // 실패 시 기존 lectureQRCode 사용 (하위 호환성)
        setQrCodeImage(lectureData.lectureQRCode || null);
        // 에러가 발생해도 사용자에게는 조용히 처리 (기존 QR 코드 표시)
      } finally {
        setIsLoading(false);
      }
    };

    fetchQRCode();
  }, [lectureId, lectureData.lectureQRCode]);

  const waitForImagesToLoad = (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName('img'));
    return Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true); // 실패해도 계속
            }
          }),
      ),
    );
  };

  const handleDownload = async () => {
    if (!containerRef.current) return;
    const div = containerRef.current;

    try {
      await waitForImagesToLoad(div);
      const dataUrl = await toPng(div, { cacheBust: true });
      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays], { type: 'image/png' });
      saveAs(blob, `${lectureData.lectureTitle} QR 코드.png`);
    } catch (error) {
      console.error('이미지 생성 실패', error);
    }
  };

  const handleShare = async () => {
    if (!containerRef.current) return;
    const div = containerRef.current;

    try {
      await waitForImagesToLoad(div);
      const dataUrl = await toPng(div, { cacheBust: true });
      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays], { type: 'image/png' });
      clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch (error) {
      console.error('이미지 생성 실패', error);
    }
  };

  return (
    <>
      <div className={styled.line} />
      <div className={styled.qr_button_wrapper}>
        <button className={styled.qr_button} onClick={handleDownload}>
          <div className={styled.icon_wrapper}>
            <IconDownload width={18} height={18} fill="black" />
          </div>
          <span>저장하기</span>
        </button>
        <div className={styled.divider} />
        <button className={styled.qr_button} onClick={handleShare}>
          <div className={styled.icon_wrapper}>
            <IconShare width={18} height={18} fill="black" />
          </div>
          <span>공유하기</span>
        </button>
      </div>

      <div className={styled.line} />

      <div className={styled.capture_area} ref={containerRef} style={style}>
        <div className={styled.title_wrapper}>
          <p className={styled.title}>{lectureData.lectureTitle}</p>
          <span className={styled.description}>
            {lectureData.lectureContent}
          </span>
        </div>

        <div className={styled.instructor}>
          <img
            src={instructorData.profileImage || NoProfile.src}
            alt={`${instructorData.name}`}
            width={24}
            height={24}
            style={{ borderRadius: '50%' }}
          />
          <p>
            <span>{instructorData.name}</span> 강사님 수업
          </p>
        </div>

        <div className={styled.qr_code}>
          {isLoading ? (
            <div style={{ width: 114, height: 114, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>로딩 중...</span>
            </div>
          ) : (
            <img
              src={qrCodeImage || ImageQRCode.src}
              alt="QR 코드 이미지"
              width={114}
              height={114}
            />
          )}
        </div>

        <div className={styled.qr_bottom}>
          QR코드를 기본 카메라로 스캔해
          <br />
          수업 초대를 수락해주세요.
        </div>
      </div>
    </>
  );
}
