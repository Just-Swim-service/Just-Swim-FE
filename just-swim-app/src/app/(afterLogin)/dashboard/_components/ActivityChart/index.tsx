'use client';

import styles from './styles.module.scss';

interface ActivityChartProps {
  data: { category: string; count: number }[];
}

const categoryColors: { [key: string]: string } = {
  질문: '#667eea',
  운동기록: '#f093fb',
  수영팁: '#4facfe',
  후기: '#43e97b',
  수영일상: '#fa709a',
};

const categoryEmojis: { [key: string]: string } = {
  질문: '❓',
  운동기록: '💪',
  수영팁: '💡',
  후기: '⭐',
  수영일상: '🏊',
};

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>활동 데이터가 없습니다.</div>;
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={styles.container}>
      {data.map((item, index) => {
        const percentage = ((item.count / total) * 100).toFixed(1);
        const color = categoryColors[item.category] || '#999';
        const emoji = categoryEmojis[item.category] || '📝';

        return (
          <div key={index} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.emoji}>{emoji}</span>
              <span className={styles.category}>{item.category}</span>
              <span className={styles.count}>{item.count}개</span>
            </div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              >
                <span className={styles.percentage}>{percentage}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

