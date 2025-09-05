'use client';

import { useCallback, useRef, useState } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

interface UseTouchOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
}

interface UseTouchReturn {
  touchStart: (event: React.TouchEvent) => void;
  touchMove: (event: React.TouchEvent) => void;
  touchEnd: (event: React.TouchEvent) => void;
  isDragging: boolean;
  dragDistance: TouchPosition;
}

export function useTouch(options: UseTouchOptions = {}): UseTouchReturn {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    longPressDelay = 500,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState<TouchPosition>({
    x: 0,
    y: 0,
  });

  const startPosition = useRef<TouchPosition>({ x: 0, y: 0 });
  const lastPosition = useRef<TouchPosition>({ x: 0, y: 0 });
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const hasMoved = useRef(false);

  const touchStart = useCallback(
    (event: React.TouchEvent) => {
      const touch = event.touches[0];
      const position = { x: touch.clientX, y: touch.clientY };

      startPosition.current = position;
      lastPosition.current = position;
      setDragDistance({ x: 0, y: 0 });
      setIsDragging(false);
      hasMoved.current = false;

      // Long press timer
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          if (!hasMoved.current) {
            onLongPress();
          }
        }, longPressDelay);
      }
    },
    [onLongPress, longPressDelay],
  );

  const touchMove = useCallback((event: React.TouchEvent) => {
    if (!startPosition.current) return;

    const touch = event.touches[0];
    const currentPosition = { x: touch.clientX, y: touch.clientY };

    const deltaX = currentPosition.x - startPosition.current.x;
    const deltaY = currentPosition.y - startPosition.current.y;

    setDragDistance({ x: deltaX, y: deltaY });
    lastPosition.current = currentPosition;

    // Check if moved enough to be considered dragging
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved.current = true;
      setIsDragging(true);

      // Clear long press timer if moved
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }
  }, []);

  const touchEnd = useCallback(
    (event: React.TouchEvent) => {
      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      if (!startPosition.current) return;

      const deltaX = lastPosition.current.x - startPosition.current.x;
      const deltaY = lastPosition.current.y - startPosition.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine swipe direction
      if (absDeltaX > threshold || absDeltaY > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      } else if (!hasMoved.current) {
        // Tap
        onTap?.();
      }

      // Reset state
      setIsDragging(false);
      setDragDistance({ x: 0, y: 0 });
      startPosition.current = { x: 0, y: 0 };
      lastPosition.current = { x: 0, y: 0 };
      hasMoved.current = false;
    },
    [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap],
  );

  return {
    touchStart,
    touchMove,
    touchEnd,
    isDragging,
    dragDistance,
  };
}
