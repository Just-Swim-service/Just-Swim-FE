'use client';

import React from 'react';
import styles from './styles.module.scss';

export default function LazyHeavyComponent() {
  return (
    <div className={styles.heavyComponent}>
      <h3>Heavy Component</h3>
      <p>This component was loaded lazily!</p>
      <div className={styles.heavyContent}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className={styles.heavyItem}>
            Heavy item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
