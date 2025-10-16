'use client';

import React from 'react';
import { CommunityPost } from '@apis';
import styles from './styles.module.scss';

interface SearchResultsProps {
  communities: CommunityPost[];
  searchQuery?: string;
  total: number;
  isLoading?: boolean;
  onCommunityClick?: (community: CommunityPost) => void;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  communities,
  searchQuery,
  total,
  isLoading = false,
  onCommunityClick,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '방금 전';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else if (diffInSeconds < 2592000) {
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      질문: '#ff6b6b',
      운동기록: '#4ecdc4',
      수영팁: '#45b7d1',
      후기: '#96ceb4',
      수영일상: '#feca57',
    };
    return colors[category] || '#6c757d';
  };

  const renderHighlightedText = (text: string, query?: string) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark key={index} className={styles.highlight}>
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  if (isLoading) {
    return (
      <div className={`${styles.searchResults} ${className}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>검색 중...</p>
        </div>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className={`${styles.searchResults} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>검색 결과가 없습니다</h3>
          <p>
            {searchQuery
              ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
              : '검색 결과가 없습니다.'}
          </p>
          <ul className={styles.suggestions}>
            <li>다른 검색어를 시도해보세요</li>
            <li>검색어의 철자를 확인해보세요</li>
            <li>더 일반적인 키워드를 사용해보세요</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.searchResults} ${className}`}>
      <div className={styles.resultsHeader}>
        <h2>{searchQuery ? `"${searchQuery}" 검색 결과` : '검색 결과'}</h2>
        <span className={styles.resultCount}>
          총 {total.toLocaleString()}개의 게시글
        </span>
      </div>

      <div className={styles.resultsList}>
        {communities.map((community) => (
          <div
            key={community.communityId}
            className={styles.resultItem}
            onClick={() => onCommunityClick?.(community)}>
            <div className={styles.resultHeader}>
              <div className={styles.categoryTag}>
                <span
                  className={styles.categoryDot}
                  style={{
                    backgroundColor: getCategoryColor(community.category),
                  }}></span>
                {community.category}
              </div>
              <span className={styles.date}>
                {formatDate(community.communityCreatedAt)}
              </span>
            </div>

            <h3 className={styles.resultTitle}>
              {renderHighlightedText(community.title, searchQuery)}
            </h3>

            <p className={styles.resultContent}>
              {renderHighlightedText(
                community.content.length > 150
                  ? community.content.substring(0, 150) + '...'
                  : community.content,
                searchQuery,
              )}
            </p>

            {community.communityTags && community.communityTags.length > 0 && (
              <div className={styles.resultTags}>
                {community.communityTags.map((communityTag, index) => (
                  <span key={index} className={styles.tag}>
                    {renderHighlightedText(
                      communityTag.tag.tagName,
                      searchQuery,
                    )}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.resultFooter}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  {community.user.profileImage ? (
                    <img
                      src={community.user.profileImage}
                      alt={community.user.name}
                    />
                  ) : (
                    <span>{community.user.name.charAt(0)}</span>
                  )}
                </div>
                <span className={styles.userName}>{community.user.name}</span>
              </div>

              <div className={styles.stats}>
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {community.viewCount}
                </span>
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.84 4.61A5.5 5.5 0 0 0 7.5 4.61L12 9.17L16.5 4.61A5.5 5.5 0 0 0 20.84 4.61Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 9.17L7.5 4.61A5.5 5.5 0 0 0 3.16 4.61L12 13.45L20.84 4.61A5.5 5.5 0 0 0 16.5 4.61L12 9.17Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {community.likeCount}
                </span>
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5V15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {community.commentCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
