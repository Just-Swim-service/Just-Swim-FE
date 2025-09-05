'use client';

import React, { memo, useMemo, useCallback } from 'react';

interface MemoizedComponentProps {
  children: React.ReactNode;
  dependencies?: any[];
  className?: string;
}

export const MemoizedComponent = memo<MemoizedComponentProps>(
  ({ children, dependencies = [], className = '' }) => {
    const memoizedChildren = useMemo(() => children, dependencies);

    return <div className={className}>{memoizedChildren}</div>;
  },
);

MemoizedComponent.displayName = 'MemoizedComponent';

// 고차 컴포넌트로 메모이제이션 적용
export function withMemoization<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean,
) {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `withMemoization(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

// 조건부 메모이제이션 훅
export function useConditionalMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  condition: boolean,
): T {
  return useMemo(
    () => {
      if (condition) {
        return factory();
      }
      return factory();
    },
    condition ? deps : [],
  );
}

// 안정적인 콜백 훅
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T {
  return useCallback(callback, deps);
}
