'use client';

import { useState, useEffect } from 'react';
import styles from './PWAInstallPrompt.module.scss';
import { IOSInstallPrompt } from './IOSInstallPrompt';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // iOS 디바이스 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Android용 beforeinstallprompt 이벤트 리스너
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

  // iOS인 경우 iOS 전용 프롬프트 표시
  if (isIOS) {
    return <IOSInstallPrompt />;
  }

  // Android인 경우 기존 프롬프트 표시
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
