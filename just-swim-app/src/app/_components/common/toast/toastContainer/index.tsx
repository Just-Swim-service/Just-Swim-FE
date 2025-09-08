'use client';

import React from 'react';
import { Toast } from '../toast';
import { ToastMessage } from '../toastProvider';
import styles from './styles.module.scss';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onHide: (id: string) => void;
}

export function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  );
}
