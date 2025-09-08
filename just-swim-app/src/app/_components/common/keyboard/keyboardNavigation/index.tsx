'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@hooks';
import styles from './styles.module.scss';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  className?: string;
}

export function KeyboardNavigation({
  children,
  direction = 'both',
  loop = false,
  className = '',
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { handleKeyDown, isKeyboardUser } = useAccessibility();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const handleKeyDownEvent = (event: KeyboardEvent) => {
      if (!isKeyboardUser) return;

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement as Element,
      );

      const keyHandlers: Record<string, () => void> = {};

      if (direction === 'horizontal' || direction === 'both') {
        keyHandlers['ArrowLeft'] = () => {
          event.preventDefault();
          const newIndex =
            currentIndex > 0
              ? currentIndex - 1
              : loop
                ? focusableElements.length - 1
                : 0;
          setFocusedIndex(newIndex);
          (focusableElements[newIndex] as HTMLElement)?.focus();
        };

        keyHandlers['ArrowRight'] = () => {
          event.preventDefault();
          const newIndex =
            currentIndex < focusableElements.length - 1
              ? currentIndex + 1
              : loop
                ? 0
                : focusableElements.length - 1;
          setFocusedIndex(newIndex);
          (focusableElements[newIndex] as HTMLElement)?.focus();
        };
      }

      if (direction === 'vertical' || direction === 'both') {
        keyHandlers['ArrowUp'] = () => {
          event.preventDefault();
          const newIndex =
            currentIndex > 0
              ? currentIndex - 1
              : loop
                ? focusableElements.length - 1
                : 0;
          setFocusedIndex(newIndex);
          (focusableElements[newIndex] as HTMLElement)?.focus();
        };

        keyHandlers['ArrowDown'] = () => {
          event.preventDefault();
          const newIndex =
            currentIndex < focusableElements.length - 1
              ? currentIndex + 1
              : loop
                ? 0
                : focusableElements.length - 1;
          setFocusedIndex(newIndex);
          (focusableElements[newIndex] as HTMLElement)?.focus();
        };
      }

      keyHandlers['Home'] = () => {
        event.preventDefault();
        setFocusedIndex(0);
        (focusableElements[0] as HTMLElement)?.focus();
      };

      keyHandlers['End'] = () => {
        event.preventDefault();
        const lastIndex = focusableElements.length - 1;
        setFocusedIndex(lastIndex);
        (focusableElements[lastIndex] as HTMLElement)?.focus();
      };

      handleKeyDown(event, keyHandlers);
    };

    container.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      container.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [direction, loop, handleKeyDown, isKeyboardUser]);

  return (
    <div
      ref={containerRef}
      className={`${styles.keyboardNavigation} ${className}`}
      role="group"
      aria-label="키보드 네비게이션">
      {children}
    </div>
  );
}

