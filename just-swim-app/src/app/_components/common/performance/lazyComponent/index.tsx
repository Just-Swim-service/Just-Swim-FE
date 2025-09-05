'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { useLazyLoading } from '@hooks';
import styles from './styles.module.scss';

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  className?: string;
}

export function LazyComponent({
  component,
  fallback = <div className={styles.skeleton} />,
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0,
  className = '',
}: LazyComponentProps) {
  const [LazyComponent, setLazyComponent] =
    React.useState<ComponentType<any> | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const {
    ref,
    isLoaded: isLazyLoaded,
    load,
  } = useLazyLoading({
    threshold,
    rootMargin,
    delay,
  });

  React.useEffect(() => {
    if (isLazyLoaded && !isLoaded) {
      const loadComponent = async () => {
        try {
          const componentModule = await component();
          setLazyComponent(() => componentModule.default);
          setIsLoaded(true);
        } catch (error) {
          console.error('Failed to load component:', error);
        }
      };

      loadComponent();
    }
  }, [isLazyLoaded, isLoaded, component]);

  return (
    <div ref={ref} className={className}>
      {LazyComponent ? (
        <Suspense fallback={fallback}>
          <LazyComponent />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
