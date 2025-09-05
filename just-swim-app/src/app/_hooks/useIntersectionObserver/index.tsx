'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: (node: Element | null) => void;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const nodeRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((node: Element | null) => {
    if (nodeRef.current) {
      if (observerRef.current) {
        observerRef.current.unobserve(nodeRef.current);
      }
    }

    nodeRef.current = node;

    if (node) {
      if (observerRef.current) {
        observerRef.current.observe(node);
      }
    }
  }, []);

  useEffect(() => {
    if (!nodeRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (freezeOnceVisible && entry.isIntersecting) {
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      },
      {
        threshold,
        root,
        rootMargin,
      },
    );

    if (nodeRef.current) {
      observerRef.current.observe(nodeRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return {
    ref,
    isIntersecting,
    entry,
  };
}
