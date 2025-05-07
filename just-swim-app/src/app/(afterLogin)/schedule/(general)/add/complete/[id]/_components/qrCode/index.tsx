'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { toPng } from 'html-to-image';
import { ClipboardItem } from 'clipboard-polyfill';
import * as clipboard from 'clipboard-polyfill';
import saveAs from 'file-saver';

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
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    const div = containerRef.current;

    try {
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

      <div className={styled.capture_area} ref={containerRef}>
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

        <div className={styled.qr_bottom}>
          QR코드를 기본 카메라로 스캔해
          <br />
          수업 초대를 수락해주세요.
        </div>
      </div>
    </>
  );
}
