'use client';

import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  loadingCount: number;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: (asyncFn: () => Promise<any>) => Promise<any>;
  setLoading: (loading: boolean) => void;
}

export function useLoading(initialState: boolean = false): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const newCount = prev + 1;
      setIsLoading(newCount > 0);
      return newCount;
    });
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      setIsLoading(newCount > 0);
      return newCount;
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    if (loading) {
      setLoadingCount(1);
      setIsLoading(true);
    } else {
      setLoadingCount(0);
      setIsLoading(false);
    }
  }, []);

  const withLoading = useCallback((asyncFn: () => Promise<any>) => {
    setLoadingCount((prev) => {
      const newCount = prev + 1;
      setIsLoading(newCount > 0);
      return newCount;
    });

    return asyncFn().finally(() => {
      setLoadingCount((prev) => {
        const newCount = Math.max(0, prev - 1);
        setIsLoading(newCount > 0);
        return newCount;
      });
    });
  }, []);

  return {
    isLoading,
    loadingCount,
    startLoading,
    stopLoading,
    withLoading,
    setLoading,
  };
}
