'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
}

interface UseVirtualizationReturn {
  virtualItems: Array<{
    index: number;
    start: number;
    end: number;
    size: number;
  }>;
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  isScrolling: boolean;
}

export function useVirtualization(
  itemCount: number,
  options: UseVirtualizationOptions,
): UseVirtualizationReturn {
  const { itemHeight, containerHeight, overscan = 5, threshold = 100 } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = itemCount * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        end: (i + 1) * itemHeight,
        size: itemHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;

      const targetScrollTop = index * itemHeight;
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    },
    [itemHeight],
  );

  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: totalHeight,
      behavior: 'smooth',
    });
  }, [totalHeight]);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    isScrolling,
  };
}
