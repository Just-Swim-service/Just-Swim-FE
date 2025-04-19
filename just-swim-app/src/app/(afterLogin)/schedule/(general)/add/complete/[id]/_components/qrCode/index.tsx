'use client';

import { useRef } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import { toPng } from 'html-to-image';
import saveAs from 'file-saver';
import * as clipboard from 'clipboard-polyfill';
import { ClipboardItem } from 'clipboard-polyfill';

import { IconDownload, IconShare, ImageQRCode } from '@assets';
import { InstructorProfileProps, LectureQRCodeProps } from '@types';
import NoProfile from '@/_assets/images/no_profile.png';

import styled from './styles.module.scss';

export function QRCode({
  lectureData,
  instructorData,
}: {
  lectureData: LectureQRCodeProps;
  instructorData: InstructorProfileProps;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.opacity = '1';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '-1';

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = 'capture.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 생성 실패', error);
    }

    element.style.position = 'absolute';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.opacity = '0';
  };

  const handleShare = async () => {
    if (!containerRef.current) return;

    try {
      const div = containerRef.current;
      const dataUrl = await toPng(div, { cacheBust: true });

      const byteCharacters = atob(dataUrl.split(',')[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArrays], { type: 'image/png' });
      clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch (error) {
      notFound();
    }
  };

  return (
    <>
      {/* 화면에 보이는 QR 카드 */}
      <div className={styled.content}>
        <div className={styled.title_wrapper}>
          <p className={styled.title}>{lectureData.lectureTitle}</p>
          <span className={styled.description}>
            {lectureData.lectureContent}
          </span>
        </div>
        <div className={styled.instructor}>
          <Image
            src={instructorData.image || NoProfile}
            alt={`${instructorData.name}`}
            width={24}
            height={24}
          />
          <p>
            <span>{instructorData.name}</span> 강사님 수업
          </p>
        </div>
        <div className={styled.qr_code}>
          <Image
            src={lectureData.lectureQRCode || ImageQRCode}
            alt="QR 코드 이미지"
            width={114}
            height={114}
          />
        </div>
        <div className={styled.qr_button_wrapper}>
          <button className={styled.qr_button} onClick={handleDownload}>
            <div className={styled.icon_wrapper}>
              <IconDownload width={18} height={18} fill="black" />
            </div>
            <span>저장하기</span>
          </button>
          <button className={styled.qr_button} onClick={handleShare}>
            <div className={styled.icon_wrapper}>
              <IconShare width={18} height={18} fill="black" />
            </div>
            <span>공유하기</span>
          </button>
        </div>
      </div>

      {/* 이미지로 저장될 전용 요소 (화면엔 안 보임) */}
      <div className={styled.capture_only} ref={containerRef}>
        <div className={styled.title_wrapper}>
          <p className={styled.title}>QR코드를 기본 카메라로 스캔해</p>
          <p className={styled.title}>수업 초대를 해주세요.</p>
        </div>
        <div className={styled.instructor}>
          <Image
            src={instructorData.image || NoProfile}
            alt={`${instructorData.name}`}
            width={24}
            height={24}
          />
          <p>
            <span>{instructorData.name}</span> 강사님 수업
          </p>
        </div>
        <div className={styled.qr_code}>
          <Image
            src={lectureData.lectureQRCode || ImageQRCode}
            alt="QR 코드 이미지"
            width={114}
            height={114}
          />
        </div>
        <div className={styled.qr_footer}>
          <p className={styled.qr_footer_title}>{lectureData.lectureTitle}</p>
          <span className={styled.qr_footer_description}>
            {lectureData.lectureContent}
          </span>
        </div>
      </div>
    </>
  );
}
