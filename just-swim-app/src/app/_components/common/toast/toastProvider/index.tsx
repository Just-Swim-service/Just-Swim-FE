'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../toast';
import { ToastContainer } from '../toastContainer';
import styles from './styles.module.scss';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (
    message: string,
    type: ToastItem['type'],
    duration?: number,
  ) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastItem['type'], duration: number = 3000) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newToast: ToastItem = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // 자동 제거
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [],
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, hideToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
