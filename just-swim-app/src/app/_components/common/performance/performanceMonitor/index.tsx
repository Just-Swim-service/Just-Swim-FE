'use client';

import React, { useEffect, useState } from 'react';
import { usePerformance } from '@hooks';
import styles from './styles.module.scss';

interface PerformanceMonitorProps {
  componentName: string;
  showMetrics?: boolean;
  className?: string;
}

export function PerformanceMonitor({
  componentName,
  showMetrics = false,
  className = '',
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    memoryUsage: 0,
    fps: 0,
  });

  const { renderCount } = usePerformance(componentName);

  useEffect(() => {
    const updateMetrics = () => {
      // 렌더링 시간 측정
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        // 메모리 사용량 측정 (Chrome에서만 지원)
        const memoryUsage = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize / 1024 / 1024
          : 0;

        // FPS 측정
        let fps = 0;
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = () => {
          frameCount++;
          const currentTime = performance.now();

          if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
          }

          requestAnimationFrame(measureFPS);
        };

        measureFPS();

        setMetrics((prev) => ({
          ...prev,
          renderTime,
          renderCount,
          memoryUsage,
          fps,
        }));
      });
    };

    updateMetrics();
  }, [renderCount]);

  if (!showMetrics) return null;

  return (
    <div className={`${styles.monitor} ${className}`}>
      <h4>Performance Metrics: {componentName}</h4>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.label}>Render Time:</span>
          <span className={styles.value}>{metrics.renderTime.toFixed(2)}ms</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Render Count:</span>
          <span className={styles.value}>{metrics.renderCount}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Memory:</span>
          <span className={styles.value}>
            {metrics.memoryUsage.toFixed(2)}MB
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>FPS:</span>
          <span className={styles.value}>{metrics.fps}</span>
        </div>
      </div>
    </div>
  );
}

