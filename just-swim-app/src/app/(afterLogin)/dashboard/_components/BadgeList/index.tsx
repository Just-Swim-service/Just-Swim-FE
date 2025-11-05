import type { BadgeInfo } from '@apis';
import styles from './styles.module.scss';

interface BadgeListProps {
  badges: BadgeInfo[];
}

export function BadgeList({ badges }: BadgeListProps) {
  return (
    <div className={styles.container}>
      {badges.map((badge, index) => (
        <div key={index} className={styles.badge}>
          <div className={styles.badgeIcon}>{badge.badgeName.charAt(0)}</div>
          <div className={styles.badgeInfo}>
            <h4 className={styles.badgeName}>{badge.badgeName}</h4>
            <p className={styles.badgeDescription}>{badge.badgeDescription}</p>
            <span className={styles.badgeDate}>
              {new Date(badge.earnedAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

