'use client';

import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../toastProvider';
import styles from './styles.module.scss';

interface ToastProps {
  toast: ToastMessage;
  onHide: (id: string) => void;
}

export function Toast({ toast, onHide }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 애니메이션을 위한 지연
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  const handleHide = () => {
    setIsLeaving(true);
    setTimeout(() => onHide(toast.id), 300); // 애니메이션 완료 후 제거
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]} ${isVisible ? styles.visible : ''} ${isLeaving ? styles.leaving : ''}`}
      onClick={handleHide}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <div className={styles.title}>{toast.title}</div>
        {toast.message && <div className={styles.message}>{toast.message}</div>}
      </div>
      <button
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation();
          handleHide();
        }}
        aria-label="닫기">
        ×
      </button>
    </div>
  );
}
