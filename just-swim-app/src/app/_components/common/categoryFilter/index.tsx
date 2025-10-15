'use client';

import { CategoryType } from '@apis';
import styles from './styles.module.scss';

interface CategoryFilterProps {
  selectedCategory: CategoryType | null;
  onCategoryChange: (category: CategoryType | null) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = [
    { value: null, label: '전체' },
    { value: CategoryType.QUESTION, label: '질문' },
    { value: CategoryType.RECORD, label: '운동기록' },
    { value: CategoryType.TIP, label: '수영팁' },
    { value: CategoryType.REVIEW, label: '후기' },
    { value: CategoryType.STORY, label: '수영일상' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.categoryList}>
        {categories.map((category) => (
          <button
            key={category.label}
            className={`${styles.categoryButton} ${
              selectedCategory === category.value ? styles.active : ''
            }`}
            onClick={() => onCategoryChange(category.value)}>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
