import { useEffect, useRef, useState } from 'react';

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
