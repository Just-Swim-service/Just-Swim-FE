'use client';

import React, { useState } from 'react';
import { CategoryType, SearchParams } from '@apis';
import styles from './styles.module.scss';

interface AdvancedSearchFilterProps {
  onFilterChange: (filters: SearchParams) => void;
  initialFilters?: SearchParams;
  className?: string;
}

const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({
  onFilterChange,
  initialFilters = {},
  className = '',
}) => {
  const [filters, setFilters] = useState<SearchParams>({
    category: initialFilters.category,
    tags: initialFilters.tags || [],
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate,
    minLikes: initialFilters.minLikes,
    minComments: initialFilters.minComments,
    sortBy: initialFilters.sortBy || 'relevance',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof SearchParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();

      if (tag && !filters.tags?.includes(tag)) {
        const newTags = [...(filters.tags || []), tag];
        handleFilterChange('tags', newTags);
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = filters.tags?.filter((tag) => tag !== tagToRemove) || [];
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters: SearchParams = {
      sortBy: 'relevance',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      filters.category ||
      (filters.tags && filters.tags.length > 0) ||
      filters.startDate ||
      filters.endDate ||
      filters.minLikes ||
      filters.minComments ||
      filters.sortBy !== 'relevance'
    );
  };

  return (
    <div className={`${styles.filterContainer} ${className}`}>
      <button
        className={`${styles.toggleButton} ${isExpanded ? styles.expanded : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}>
        <span>고급 검색 필터</span>
        <span className={styles.filterCount}>
          {hasActiveFilters()
            ? Object.keys(filters).filter(
                (key) => key !== 'sortBy' && filters[key as keyof SearchParams],
              ).length
            : 0}
        </span>
        <svg
          className={`${styles.arrow} ${isExpanded ? styles.rotated : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none">
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className={styles.filterContent}>
          {/* 카테고리 필터 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>카테고리</label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                handleFilterChange('category', e.target.value || undefined)
              }
              className={styles.select}>
              <option value="">전체</option>
              <option value={CategoryType.QUESTION}>질문</option>
              <option value={CategoryType.RECORD}>운동기록</option>
              <option value={CategoryType.TIP}>수영팁</option>
              <option value={CategoryType.REVIEW}>후기</option>
              <option value={CategoryType.STORY}>수영일상</option>
            </select>
          </div>

          {/* 태그 필터 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>태그</label>
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                placeholder="태그를 입력하고 엔터를 누르세요"
                onKeyDown={handleTagInput}
                className={styles.tagInput}
              />
              {filters.tags && filters.tags.length > 0 && (
                <div className={styles.tagList}>
                  {filters.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className={styles.tagRemove}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 날짜 범위 필터 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>날짜 범위</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  handleFilterChange('startDate', e.target.value || undefined)
                }
                className={styles.dateInput}
              />
              <span className={styles.dateSeparator}>~</span>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  handleFilterChange('endDate', e.target.value || undefined)
                }
                className={styles.dateInput}
              />
            </div>
          </div>

          {/* 최소 좋아요/댓글 수 필터 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>최소 좋아요 수</label>
            <input
              type="number"
              min="0"
              value={filters.minLikes || ''}
              onChange={(e) =>
                handleFilterChange(
                  'minLikes',
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              className={styles.numberInput}
              placeholder="0"
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>최소 댓글 수</label>
            <input
              type="number"
              min="0"
              value={filters.minComments || ''}
              onChange={(e) =>
                handleFilterChange(
                  'minComments',
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
              className={styles.numberInput}
              placeholder="0"
            />
          </div>

          {/* 정렬 옵션 */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>정렬 기준</label>
            <select
              value={filters.sortBy || 'relevance'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className={styles.select}>
              <option value="relevance">관련도순</option>
              <option value="recent">최신순</option>
              <option value="popular">인기순</option>
              <option value="likes">좋아요순</option>
              <option value="comments">댓글순</option>
              <option value="views">조회순</option>
            </select>
          </div>

          {/* 필터 초기화 버튼 */}
          {hasActiveFilters() && (
            <div className={styles.filterActions}>
              <button onClick={clearFilters} className={styles.clearButton}>
                필터 초기화
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilter;
