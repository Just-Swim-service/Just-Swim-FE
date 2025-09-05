'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../useIntersectionObserver';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

interface UseLazyLoadingReturn {
  ref: (node: Element | null) => void;
  isLoaded: boolean;
  isVisible: boolean;
  load: () => void;
}

export function useLazyLoading(
  options: UseLazyLoadingOptions = {},
): UseLazyLoadingReturn {
  const { threshold = 0.1, rootMargin = '50px', delay = 0 } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });

  const load = useCallback(() => {
    if (isLoaded) return;

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsLoaded(true);
      }, delay);
    } else {
      setIsLoaded(true);
    }
  }, [isLoaded, delay]);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsVisible(true);
      load();
    }
  }, [isIntersecting, isLoaded, load]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      intersectionRef(node);
    },
    [intersectionRef],
  );

  return {
    ref,
    isLoaded,
    isVisible,
    load,
  };
}
