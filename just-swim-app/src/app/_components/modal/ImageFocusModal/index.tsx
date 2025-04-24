'use client';

import { useState, useRef } from 'react';
import { ImageFocusModalProps } from '@types';
import styles from './styles.module.scss';

export function ImageFocusModal({
  onClose,
  images,
  currentIndex,
}: ImageFocusModalProps) {
  const [index, setIndex] = useState(currentIndex);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 50 && index < images.length - 1) {
      setIndex(index + 1);
    } else if (deltaX < -50 && index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_wrapper}>
        <button className={styles.close_button} onClick={onClose}>
          X
        </button>
        <div
          className={styles.content}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <img src={images[index]} alt="미리보기" className={styles.image} />
        </div>
        <div className={styles.dots}>
          {images.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
