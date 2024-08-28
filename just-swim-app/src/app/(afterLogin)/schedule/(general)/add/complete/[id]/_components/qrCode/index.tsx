'use client';

import { useRef } from "react";
import { notFound } from "next/navigation";
import Image from 'next/image';

import html2canvas from "html2canvas";
import saveAs from "file-saver";
import * as clipboard from 'clipboard-polyfill';
import { ClipboardItem } from 'clipboard-polyfill';

import { IconDownload, IconShare, ImageQRCode } from "@assets";
import { LectureProps, ProfileProps } from "@types";

import styled from './styles.module.scss';

export function QRCode({
  lectureData,
  instructorData,
}: {
  lectureData: LectureProps,
  instructorData: ProfileProps,
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      const div = containerRef.current;
      const canvas = await html2canvas(div, { scale: 2 });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${lectureData.lectureTitle} QR 코드.png`);
        }
      });
    } catch (error) {
      notFound();
    }
  };

  const handleShare = async () => {
    if (!containerRef.current) return;

    try {
      const div = containerRef.current;
      const canvas = await html2canvas(div, { scale: 2 });

      canvas.toBlob((blob) => {
        if (blob) {
          clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        }
      });
    } catch (error) {
      notFound();
    }
  }

  return (
    <div className={styled.content} ref={containerRef}>
      <div className={styled.title_wrapper}>
        <p className={styled.title}>{lectureData.lectureTitle}</p>
        <span className={styled.description}>{lectureData.lectureContent}</span>
      </div>
      <div className={styled.instructor}>
        <Image
          src={instructorData.profileImage}
          alt={`${instructorData.name}`}
          width={24}
          height={24}
        />
        <p><span>{instructorData.name}</span> 강사님 수업</p>
      </div>
      <div className={styled.qr_code}>
        <Image
          src={ImageQRCode}
          alt='QR 코드 이미지'
          width={114}
          height={114}
        />
      </div>
      <div className={styled.qr_button_wrapper}>
        <button className={styled.qr_button} onClick={handleDownload}>
          <div className={styled.icon_wrapper}>
            <IconDownload />
          </div>
          <span>저장하기</span>
        </button>
        <button className={styled.qr_button} onClick={handleShare}>
          <div className={styled.icon_wrapper}>
            <IconShare />
          </div>
          <span>공유하기</span>
        </button>
      </div>
    </div>
  )
}