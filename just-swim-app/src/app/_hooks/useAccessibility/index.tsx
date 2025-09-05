'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseAccessibilityOptions {
  announceChanges?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
}

interface UseAccessibilityReturn {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocus: (element: HTMLElement | null) => void;
  trapFocus: (container: HTMLElement | null) => void;
  releaseFocus: () => void;
  handleKeyDown: (
    event: KeyboardEvent,
    handlers: Record<string, () => void>,
  ) => void;
  isKeyboardUser: boolean;
  reducedMotion: boolean;
}

export function useAccessibility(
  options: UseAccessibilityOptions = {},
): UseAccessibilityReturn {
  const {
    announceChanges = true,
    focusManagement = true,
    keyboardNavigation = true,
  } = options;

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const focusTrapRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // 키보드 사용자 감지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // 애니메이션 감소 설정 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 스크린 리더에 메시지 전달
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (!announceChanges) return;

      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;

      document.body.appendChild(announcement);

      // 메시지가 읽힌 후 제거
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    [announceChanges],
  );

  // 포커스 설정
  const setFocus = useCallback(
    (element: HTMLElement | null) => {
      if (!focusManagement || !element) return;

      element.focus();
    },
    [focusManagement],
  );

  // 포커스 트랩
  const trapFocus = useCallback(
    (container: HTMLElement | null) => {
      if (!focusManagement || !container) return;

      focusTrapRef.current = container;
      previousFocusRef.current = document.activeElement as HTMLElement;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      container.addEventListener('keydown', handleKeyDown);
      firstElement.focus();

      return () => {
        container.removeEventListener('keydown', handleKeyDown);
      };
    },
    [focusManagement],
  );

  // 포커스 트랩 해제
  const releaseFocus = useCallback(() => {
    if (!focusManagement) return;

    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
    focusTrapRef.current = null;
  }, [focusManagement]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback(
    (event: KeyboardEvent, handlers: Record<string, () => void>) => {
      if (!keyboardNavigation) return;

      const handler = handlers[event.key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    },
    [keyboardNavigation],
  );

  return {
    announce,
    setFocus,
    trapFocus,
    releaseFocus,
    handleKeyDown,
    isKeyboardUser,
    reducedMotion,
  };
}
