'use client';

import { useEffect, useState } from 'react';
import { IconArrowLeft, IconArrowRight } from '@assets';
import { Portal } from '@components';
import styled from './styles.module.scss';
import Image from 'next/image';

interface ImageFocusModalProps {
  imageUrl: string;
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

export function ImageFocusModal({
  imageUrl,
  images,
  currentIndex,
  onClose,
}: ImageFocusModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    // 현재 파일이 동영상인지 확인
    const currentFile = images[currentImageIndex];
    setIsVideo(currentFile?.includes('video') || currentFile?.includes('mp4'));
  }, [currentImageIndex, images]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Portal>
      <div className={styled.modal_overlay} onClick={onClose}>
        <div
          className={styled.modal_content}
          onClick={(e) => e.stopPropagation()}>
          <button className={styled.close_button} onClick={onClose}>
            ✕
          </button>

          <button className={styled.nav_button_left} onClick={handlePrevious}>
            <IconArrowLeft width={24} height={24} />
          </button>

          <div className={styled.media_container}>
            {isVideo ? (
              <video
                src={images[currentImageIndex]}
                controls
                autoPlay
                className={styled.video}>
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className={styled.image}
              />
            )}
          </div>

          <button className={styled.nav_button_right} onClick={handleNext}>
            <IconArrowRight width={24} height={24} />
          </button>

          <div className={styled.image_counter}>
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </Portal>
  );
}
