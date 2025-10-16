'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  searchCommunities,
  advancedSearchCommunities,
  getRelatedTags,
  SearchParams,
  CommunityPost,
} from '@apis';
import styles from './styles.module.scss';
import SearchBar from '@/_components/common/searchBar';
import AdvancedSearchFilter from '@/_components/common/advancedSearchFilter';
import SearchResults from '@/_components/common/searchResults';

const CommunitySearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [communities, setCommunities] = useState<CommunityPost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchParams>({});
  const [relatedTags, setRelatedTags] = useState<any[]>([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const limit = 10;

  // URL 파라미터에서 초기 검색어와 필터 설정
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlCategory = searchParams.get('category');
    const urlTags = searchParams.get('tags');
    const urlSortBy = searchParams.get('sortBy');

    if (urlQuery) {
      setQuery(urlQuery);
    }

    const initialFilters: SearchParams = {};
    if (urlCategory) initialFilters.category = urlCategory as any;
    if (urlTags) initialFilters.tags = urlTags.split(',');
    if (urlSortBy) initialFilters.sortBy = urlSortBy as any;

    setFilters(initialFilters);
  }, [searchParams]);

  // 검색 실행
  const performSearch = async (
    searchQuery: string,
    searchFilters: SearchParams = {},
    page: number = 1,
  ) => {
    setIsLoading(true);
    try {
      let response;

      if (
        Object.keys(searchFilters).length > 0 ||
        searchFilters.sortBy !== 'relevance'
      ) {
        // 고급 검색
        response = await advancedSearchCommunities(
          { ...searchFilters, query: searchQuery },
          page,
          limit,
        );
      } else {
        // 기본 검색
        response = await searchCommunities(
          searchQuery,
          page,
          limit,
          searchFilters.sortBy || 'relevance',
        );
      }

      setCommunities(response.communities);
      setTotal(response.pagination.total);
      setCurrentPage(page);

      // 관련 태그 가져오기
      if (searchQuery) {
        try {
          const tags = await getRelatedTags(searchQuery, 8);
          setRelatedTags(tags);
        } catch (error) {
          console.error('관련 태그 조회 오류:', error);
        }
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setCommunities([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (query.trim()) {
      performSearch(query, filters, 1);
    } else {
      setCommunities([]);
      setTotal(0);
      setRelatedTags([]);
    }
  }, [query, filters]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);

    // URL 업데이트
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.tags && filters.tags.length > 0)
      params.set('tags', filters.tags.join(','));
    if (filters.sortBy && filters.sortBy !== 'relevance')
      params.set('sortBy', filters.sortBy);

    router.push(`/community/search?${params.toString()}`);
  };

  const handleFilterChange = (newFilters: SearchParams) => {
    setFilters(newFilters);
    setCurrentPage(1);

    // URL 업데이트
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.tags && newFilters.tags.length > 0)
      params.set('tags', newFilters.tags.join(','));
    if (newFilters.sortBy && newFilters.sortBy !== 'relevance')
      params.set('sortBy', newFilters.sortBy);

    router.push(`/community/search?${params.toString()}`);
  };

  const handleCommunityClick = (community: CommunityPost) => {
    router.push(`/community/${community.communityId}`);
  };

  const handleRelatedTagClick = (tagName: string) => {
    const newFilters = {
      ...filters,
      tags: [...(filters.tags || []), tagName],
    };
    handleFilterChange(newFilters);
  };

  const handleLoadMore = () => {
    if (!isLoading && currentPage * limit < total) {
      performSearch(query, filters, currentPage + 1);
    }
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchContainer}>
        <div className={styles.searchHeader}>
          <h1>커뮤니티 검색</h1>
          <p>수영 관련 게시글을 검색해보세요</p>
        </div>

        <div className={styles.searchSection}>
          <SearchBar
            placeholder="게시글 제목, 내용, 태그로 검색..."
            onSearch={handleSearch}
            showSuggestions={true}
            className={styles.searchBar}
          />

          <button
            className={`${styles.advancedToggle} ${showAdvancedFilter ? styles.active : ''}`}
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
            고급 검색 필터
            <svg
              className={`${styles.arrow} ${showAdvancedFilter ? styles.rotated : ''}`}
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

          {showAdvancedFilter && (
            <AdvancedSearchFilter
              onFilterChange={handleFilterChange}
              initialFilters={filters}
              className={styles.advancedFilter}
            />
          )}
        </div>

        {/* 관련 태그 */}
        {relatedTags.length > 0 && (
          <div className={styles.relatedTags}>
            <h3>관련 태그</h3>
            <div className={styles.tagList}>
              {relatedTags.map((tag, index) => (
                <button
                  key={index}
                  className={styles.relatedTag}
                  onClick={() => handleRelatedTagClick(tag.tagName)}>
                  {tag.tagName}
                  <span className={styles.tagCount}>({tag.usageCount})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        <SearchResults
          communities={communities}
          searchQuery={query}
          total={total}
          isLoading={isLoading}
          onCommunityClick={handleCommunityClick}
          className={styles.searchResults}
        />

        {/* 더 보기 버튼 */}
        {communities.length > 0 && currentPage * limit < total && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.loadMoreButton}
              onClick={handleLoadMore}
              disabled={isLoading}>
              {isLoading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySearchPage;
