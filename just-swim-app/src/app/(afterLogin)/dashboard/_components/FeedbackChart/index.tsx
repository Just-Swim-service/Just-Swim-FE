'use client';

import styles from './styles.module.scss';

interface FeedbackChartProps {
  data: { month: string; count: number }[];
}

export function FeedbackChart({ data }: FeedbackChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.empty}>피드백 데이터가 없습니다.</div>
    );
  }

  // 최근 6개월 데이터만 표시
  const recentData = data.slice(-6);
  const maxCount = Math.max(...recentData.map((d) => d.count), 1);

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {recentData.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          const monthLabel = item.month.split('-')[1] + '월';

          return (
            <div key={index} className={styles.barWrapper}>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ height: `${height}%` }}
                >
                  <span className={styles.count}>{item.count}</span>
                </div>
              </div>
              <span className={styles.label}>{monthLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

