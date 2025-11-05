import type { LevelInfo } from '@apis';
import styles from './styles.module.scss';

interface LevelProgressProps {
  levelInfo: LevelInfo;
}

export function LevelProgress({ levelInfo }: LevelProgressProps) {
  const {
    currentLevel,
    levelName,
    progress,
    currentStreak,
    longestStreak,
    currentExp,
    expToNextLevel,
  } = levelInfo;

  return (
    <div className={styles.container}>
      <div className={styles.levelSection}>
        <div className={styles.levelBadge}>
          <span className={styles.level}>Lv. {currentLevel}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
        
        <div className={styles.expSection}>
          <div className={styles.expInfo}>
            <span>경험치: {currentExp} / 100</span>
            <span className={styles.remaining}>
              (다음 레벨까지 {expToNextLevel} 필요)
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.streakSection}>
        <div className={styles.streakItem}>
          <div className={styles.streakIcon}>🔥</div>
          <div className={styles.streakInfo}>
            <span className={styles.streakLabel}>현재 연속</span>
            <span className={styles.streakValue}>{currentStreak}일</span>
          </div>
        </div>
        <div className={styles.streakDivider} />
        <div className={styles.streakItem}>
          <div className={styles.streakIcon}>🏆</div>
          <div className={styles.streakInfo}>
            <span className={styles.streakLabel}>최장 연속</span>
            <span className={styles.streakValue}>{longestStreak}일</span>
          </div>
        </div>
      </div>
    </div>
  );
}

