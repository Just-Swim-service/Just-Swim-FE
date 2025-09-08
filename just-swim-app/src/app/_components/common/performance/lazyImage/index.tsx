'use client';

import React, { useState } from 'react';
import { useLazyLoading } from '@hooks';
import styles from './styles.module.scss';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
  className = '',
  width,
  height,
  threshold = 0.1,
  rootMargin = '50px',
  delay = 0,
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    ref,
    isLoaded: isLazyLoaded,
    load,
  } = useLazyLoading({
    threshold,
    rootMargin,
    delay,
  });

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  React.useEffect(() => {
    if (isLazyLoaded && !isLoaded && !hasError) {
      setImageSrc(src);
    }
  }, [isLazyLoaded, src, isLoaded, hasError]);

  return (
    <div
      ref={ref}
      className={`${styles.container} ${className}`}
      style={{ width, height }}>
      <img
        src={imageSrc}
        alt={alt}
        className={`${styles.image} ${isLoaded ? styles.loaded : ''} ${hasError ? styles.error : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      {!isLazyLoaded && (
        <div className={styles.placeholder}>
          <div className={styles.skeleton} />
        </div>
      )}
    </div>
  );
}

