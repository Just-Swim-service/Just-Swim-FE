'use client';

import { type CommunityTag } from '@apis';
import styles from './styles.module.scss';

interface TagDisplayProps {
  tags: CommunityTag[] | undefined;
  maxDisplay?: number;
  onTagClick?: (tagName: string) => void;
}

export function TagDisplay({
  tags,
  maxDisplay = 5,
  onTagClick,
}: TagDisplayProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  const displayTags = tags.slice(0, maxDisplay);
  const remainingCount = tags.length - maxDisplay;

  return (
    <div className={styles.container}>
      {displayTags.map((communityTag) => (
        <button
          key={communityTag.tag.tagId}
          className={styles.tag}
          onClick={(e) => {
            if (onTagClick) {
              e.stopPropagation();
              onTagClick(communityTag.tag.tagName);
            }
          }}
          type="button">
          #{communityTag.tag.tagName}
        </button>
      ))}
      {remainingCount > 0 && (
        <span className={styles.remainingCount}>+{remainingCount}</span>
      )}
    </div>
  );
}

