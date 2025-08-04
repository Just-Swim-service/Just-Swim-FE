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
  const [isStandalone, setIsStandalone] = useState(false);

  // 로컬 스토리지에서 PWA 상태 확인
  const checkPWAStatus = () => {
    const dismissed = localStorage.getItem('android-pwa-dismissed');
    const accepted = localStorage.getItem('android-pwa-accepted');

    // 30일 후에 거부 상태 초기화 (사용자가 다시 고려할 수 있도록)
    if (dismissed) {
      const dismissTime = parseInt(dismissed);
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissTime > thirtyDaysInMs) {
        localStorage.removeItem('android-pwa-dismissed');
        return { dismissed: false, accepted: !!accepted };
      }
    }

    return { dismissed: !!dismissed, accepted: !!accepted };
  };

  // 설치 상태 모니터링
  const checkInstallationStatus = () => {
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;

    // PWA로 실행 중이 아니라면 이전에 설치했다고 기록된 상태를 초기화
    if (!isStandaloneMode) {
      const accepted = localStorage.getItem('android-pwa-accepted');
      if (accepted) {
        // 설치했다고 기록되어 있지만 현재 PWA로 실행되지 않는다면 앱이 제거된 것으로 간주
        localStorage.removeItem('android-pwa-accepted');
      }
    }

    setIsStandalone(isStandaloneMode);
  };

  useEffect(() => {
    // iOS 디바이스 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 초기 설치 상태 확인
    checkInstallationStatus();

    // 이미 설치되어 있거나 iOS인 경우 프롬프트 표시하지 않음
    if (isStandalone || isIOSDevice) {
      return;
    }

    // Android용 beforeinstallprompt 이벤트 리스너
    const handler = (e: Event) => {
      e.preventDefault();

      const { dismissed, accepted } = checkPWAStatus();

      if (!dismissed && !accepted) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 페이지 포커스 시 설치 상태 재확인
    const handleFocus = () => {
      checkInstallationStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA 설치가 수락되었습니다.');
      localStorage.setItem('android-pwa-accepted', Date.now().toString());
    } else {
      console.log('PWA 설치가 거부되었습니다.');
      localStorage.setItem('android-pwa-dismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
    localStorage.setItem('android-pwa-dismissed', Date.now().toString());
  };

  // iOS인 경우 iOS 전용 프롬프트 표시
  if (isIOS) {
    return <IOSInstallPrompt />;
  }

  // 이미 설치되어 있거나 프롬프트를 표시하지 않아야 하는 경우
  if (isStandalone || !showInstallPrompt) return null;

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
