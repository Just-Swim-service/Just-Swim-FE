import { useEffect, useRef, useState, useCallback } from 'react';

export const usePerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    startTime.current = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;

      if (renderTime > 16) {
        // 60fps 기준
        console.warn(
          `[Performance] ${componentName} 렌더링 시간: ${renderTime.toFixed(2)}ms (${renderCount.current}번째 렌더)`,
        );
      }
    };
  });

  return {
    renderCount: renderCount.current,
  };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 페이지 이동 성능 측정 훅
export const useNavigationPerformance = () => {
  const [navigationTime, setNavigationTime] = useState<number>(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const measureNavigation = useCallback((navigationFn: () => void) => {
    const startTime = performance.now();
    setIsNavigating(true);

    try {
      navigationFn();
    } finally {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setNavigationTime(duration);
      setIsNavigating(false);

      if (duration > 1000) {
        console.warn(`🐌 Slow Navigation: ${duration.toFixed(2)}ms`);
      } else {
        console.debug(`✅ Fast Navigation: ${duration.toFixed(2)}ms`);
      }
    }
  }, []);

  return {
    navigationTime,
    isNavigating,
    measureNavigation,
  };
};
