'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyLevel, type LevelInfo } from '@apis';
import styles from './styles.module.scss';

export function LevelBadge() {
  const router = useRouter();
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);

  useEffect(() => {
    fetchLevel();
  }, []);

  const fetchLevel = async () => {
    try {
      const response = await getMyLevel();
      if (response.ok) {
        setLevelInfo(response.data.data);
      }
    } catch (error) {
      console.error('레벨 조회 실패:', error);
    }
  };

  if (!levelInfo) return null;

  return (
    <div className={styles.container} onClick={() => router.push('/dashboard/customer')}>
      <div className={styles.levelInfo}>
        <span className={styles.level}>Lv.{levelInfo.currentLevel}</span>
        <span className={styles.levelName}>{levelInfo.levelName}</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${levelInfo.progress}%` }}
        />
      </div>
      <div className={styles.details}>
        <span className={styles.exp}>
          EXP {levelInfo.currentExp}/100
        </span>
        {levelInfo.currentStreak > 0 && (
          <span className={styles.streak}>
            🔥 {levelInfo.currentStreak}일
          </span>
        )}
      </div>
    </div>
  );
}

