'use client';

import React, { useEffect } from 'react';
import { useAccessibility } from '@hooks';

interface KeyboardShortcutsProps {
  shortcuts: Record<string, () => void>;
  enabled?: boolean;
}

export function KeyboardShortcuts({
  shortcuts,
  enabled = true,
}: KeyboardShortcutsProps) {
  const { handleKeyDown } = useAccessibility();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDownEvent = (event: KeyboardEvent) => {
      // Ctrl/Cmd + 키 조합 처리
      const key =
        event.ctrlKey || event.metaKey ? `Ctrl+${event.key}` : event.key;

      const handler = shortcuts[key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [shortcuts, enabled, handleKeyDown]);

  return null;
}

