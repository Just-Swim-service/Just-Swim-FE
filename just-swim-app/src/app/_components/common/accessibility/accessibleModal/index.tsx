'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '@hooks';
import { FocusTrap } from '../focusTrap';
import { Announcer } from '../announcer';
import styles from './styles.module.scss';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { announce, setFocus, handleKeyDown, reducedMotion } =
    useAccessibility();

  useEffect(() => {
    if (isOpen) {
      // 모달 열림을 스크린 리더에 알림
      announce(`${title} 모달이 열렸습니다.`);

      // 모달에 포커스 설정
      if (modalRef.current) {
        setFocus(modalRef.current);
      }

      // ESC 키로 닫기
      const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDownEvent);

      // 스크롤 방지
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDownEvent);
        document.body.style.overflow = 'unset';
      };
    } else {
      // 모달 닫힘을 스크린 리더에 알림
      announce(`${title} 모달이 닫혔습니다.`);
    }
  }, [isOpen, title, onClose, announce, setFocus, closeOnEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <Announcer message={`${title} 모달이 열렸습니다.`} priority="assertive" />
      <div
        className={styles.overlay}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title">
        <FocusTrap isActive={isOpen}>
          <div
            ref={modalRef}
            className={`${styles.modal} ${reducedMotion ? styles.reducedMotion : ''} ${className}`}
            tabIndex={-1}>
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="모달 닫기">
                ✕
              </button>
            </div>
            <div className={styles.content}>{children}</div>
          </div>
        </FocusTrap>
      </div>
    </>
  );
}

