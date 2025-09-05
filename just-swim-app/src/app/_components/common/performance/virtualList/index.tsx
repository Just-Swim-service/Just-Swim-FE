'use client';

import React, { useRef } from 'react';
import { useVirtualization } from '@hooks';
import styles from './styles.module.scss';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, scrollToIndex, isScrolling } =
    useVirtualization(items.length, {
      itemHeight,
      containerHeight,
      overscan,
    });

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isScrolling ? styles.scrolling : ''} ${className}`}
      style={{ height: containerHeight }}>
      <div className={styles.scrollContainer} style={{ height: totalHeight }}>
        {virtualItems.map(({ index, start }) => (
          <div
            key={index}
            className={styles.item}
            style={{
              position: 'absolute',
              top: start,
              height: itemHeight,
              width: '100%',
            }}>
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}
