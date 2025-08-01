'use client';

import { useState, useEffect } from 'react';
import styles from './PWAInstallPrompt.module.scss';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA 설치가 수락되었습니다.');
    } else {
      console.log('PWA 설치가 거부되었습니다.');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.prompt}>
        <div className={styles.content}>
          <h3>Just Swim 앱 설치</h3>
          <p>홈 화면에 앱을 추가하여 더 빠르게 접근하세요!</p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleDismiss} className={styles.dismiss}>
            나중에
          </button>
          <button onClick={handleInstallClick} className={styles.install}>
            설치
          </button>
        </div>
      </div>
    </div>
  );
}; 