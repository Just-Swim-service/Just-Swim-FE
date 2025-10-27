'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { IconAdd, IconBookmark, IconBookmarkFilled } from '@assets';
import { toggleBookmark } from '@apis';
import { BottomNav, UserIconHeader } from '@components';
import { CommunityCard } from '@components';
import { InlineLoader, Spinner } from '@components';
import { CategoryFilter, TagDisplay } from '@components';
import {
  getCommunities,
  searchCommunities,
  advancedSearchCommunities,
  getRelatedTags,
  type CommunityPost,
  type CategoryType,
  type SearchParams,
  type Tag,
} from '@apis';

import styled from './styles.module.scss';
import Link from 'next/link';
import SearchBar from '@/_components/common/searchBar';
import AdvancedSearchFilter from '@/_components/common/advancedSearchFilter';

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showBookmarkOnly, setShowBookmarkOnly] = useState(false);

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CommunityPost[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 고급 검색 관련 상태
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchParams>({});
  const [relatedTags, setRelatedTags] = useState<Tag[]>([]);

  const fetchPosts = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await getCommunities(
        pageNum,
        10,
        selectedCategory || undefined,
        selectedTags.length > 0 ? selectedTags : undefined,
      );

      if (pageNum === 1 || reset) {
        setPosts(response.communities);
      } else {
        setPosts((prev) => [...prev, ...response.communities]);
      }

      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      if (pageNum === 1 || reset) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // URL 파라미터에서 초기 검색어 로드
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setIsSearchMode(true);
    } else {
      fetchPosts();
    }
  }, []);

  // 필터가 변경될 때마다 첫 페이지부터 다시 조회
  useEffect(() => {
    if (!isSearchMode) {
      setPage(1);
      fetchPosts(1, true);
    }
  }, [selectedCategory, selectedTags]);

  // 검색 쿼리나 필터가 변경되면 검색 실행
  useEffect(() => {
    if (searchQuery.trim() && isSearchMode) {
      performSearch(searchQuery, searchFilters);
    }
  }, [searchQuery, searchFilters]);

  const handleCreatePost = () => {
    router.push('/community/create');
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/${postId}`);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleCategoryChange = (category: CategoryType | null) => {
    setSelectedCategory(category);
    setSelectedTags([]); // 카테고리 변경 시 태그 필터 초기화
  };

  const handleTagClick = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([tagName]);
      setSelectedCategory(null); // 태그 선택 시 카테고리 필터 초기화
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
  };

  // 검색 실행 함수 (고급 검색 지원)
  const performSearch = async (query: string, filters: SearchParams = {}) => {
    if (!query.trim()) {
      // 검색어가 비어있으면 일반 게시글 목록으로 돌아가기
      handleClearSearch();
      return;
    }

    setSearchLoading(true);
    setIsSearchMode(true);
    setSearchQuery(query);

    try {
      let response;

      // 필터가 있거나 고급 정렬 옵션을 사용하면 고급 검색, 그 외에는 기본 검색
      const needsAdvancedSearch =
        filters.category ||
        filters.tags?.length ||
        filters.startDate ||
        filters.endDate ||
        filters.minLikes ||
        filters.minComments ||
        (filters.sortBy &&
          !['recent', 'popular', 'relevance'].includes(filters.sortBy));

      if (needsAdvancedSearch) {
        response = await advancedSearchCommunities({ ...filters, query }, 1, 10);
      } else {
        // 기본 검색 API는 'recent', 'popular', 'relevance'만 지원
        const sortBy =
          filters.sortBy === 'recent' || filters.sortBy === 'popular'
            ? filters.sortBy
            : 'relevance';
        response = await searchCommunities(query, 1, 10, sortBy);
      }

      setSearchResults(response.communities);
      setSearchTotal(response.pagination.total);

      // 관련 태그 가져오기
      try {
        const tags = await getRelatedTags(query, 8);
        setRelatedTags(tags);
      } catch (error) {
        console.error('관련 태그 조회 오류:', error);
        setRelatedTags([]);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
      setSearchTotal(0);
      setRelatedTags([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    // URL 업데이트
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query);
    }
    const newUrl = params.toString()
      ? `/community?${params.toString()}`
      : '/community';
    router.push(newUrl);

    performSearch(query, searchFilters);
  };

  const handleFilterChange = (newFilters: SearchParams) => {
    setSearchFilters(newFilters);
  };

  // 검색 취소 함수
  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchTotal(0);
    setSearchFilters({});
    setRelatedTags([]);
    setShowAdvancedFilter(false);
    router.push('/community');
  };

  // 관련 태그 클릭 핸들러
  const handleRelatedTagClick = (tagName: string) => {
    const newFilters = {
      ...searchFilters,
      tags: [...(searchFilters.tags || []), tagName],
    };
    setSearchFilters(newFilters);
  };

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async (communityId: number) => {
    try {
      await toggleBookmark(communityId);
      // 목록 업데이트
      fetchPosts(page, true);
    } catch (error) {
      console.error('북마크 처리 실패:', error);
    }
  };

  return (
    <div className={styled.container}>
      <UserIconHeader title="커뮤니티" />

      {/* 검색바 */}
      <div className={styled.searchSection}>
        <div className={styled.searchBarWrapper}>
          <SearchBar
            placeholder="게시글을 검색해보세요..."
            onSearch={handleSearch}
            onClear={handleClearSearch}
            showSuggestions={true}
            className={styled.searchBar}
            value={searchQuery}
          />
        </div>

        {isSearchMode && (
          <>
            {/* 고급 검색 필터 토글 버튼과 북마크 버튼 */}
            <div className={styled.filterButtons}>
              <button
                className={`${styled.advancedToggle} ${showAdvancedFilter ? styled.active : ''}`}
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
                고급 검색 필터
                <svg
                  className={`${styled.arrow} ${showAdvancedFilter ? styled.rotated : ''}`}
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

              <button
                className={`${styled.bookmarkToggle} ${showBookmarkOnly ? styled.active : ''}`}
                onClick={() => setShowBookmarkOnly(!showBookmarkOnly)}
                title="북마크한 글">
                {showBookmarkOnly ? (
                  <IconBookmarkFilled width={20} height={20} />
                ) : (
                  <IconBookmark width={20} height={20} />
                )}
              </button>
            </div>

            {/* 고급 검색 필터 */}
            {showAdvancedFilter && (
              <AdvancedSearchFilter
                onFilterChange={handleFilterChange}
                initialFilters={searchFilters}
                className={styled.advancedFilter}
              />
            )}

            {/* 관련 태그 */}
            {relatedTags.length > 0 && (
              <div className={styled.relatedTags}>
                <h3 className={styled.relatedTagsTitle}>관련 태그</h3>
                <div className={styled.relatedTagsList}>
                  {relatedTags.map((tag) => (
                    <button
                      key={tag.tagId}
                      className={styled.relatedTag}
                      onClick={() => handleRelatedTagClick(tag.tagName)}>
                      #{tag.tagName}
                      <span className={styled.tagCount}>({tag.usageCount})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 카테고리 필터 및 북마크 버튼 (일반 모드일 때만 표시) */}
      {!isSearchMode && (
        <>
          <div className={styled.bookmarkButtonContainer}>
            <button
              className={`${styled.bookmarkButton} ${showBookmarkOnly ? styled.active : ''}`}
              onClick={() => setShowBookmarkOnly(!showBookmarkOnly)}
              title="북마크한 글">
              {showBookmarkOnly ? (
                <IconBookmarkFilled width={24} height={24} />
              ) : (
                <IconBookmark width={24} height={24} />
              )}
            </button>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* 선택된 태그 표시 */}
          {selectedTags.length > 0 && (
            <div className={styled.selectedTagsContainer}>
              <span className={styled.filterLabel}>필터:</span>
              <div className={styled.selectedTags}>
                {selectedTags.map((tag) => (
                  <div key={tag} className={styled.selectedTag}>
                    <span>#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className={styled.removeTagButton}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className={styled.content}>
        {isSearchMode ? (
          // 검색 모드일 때 CommunityCard로 통일된 스타일 사용
          <>
            <div className={styled.searchResultsHeader}>
              <h2>&quot;{searchQuery}&quot; 검색 결과</h2>
              <span className={styled.resultCount}>
                총 {searchTotal.toLocaleString()}개의 게시글
              </span>
            </div>
            {searchLoading ? (
              <div className={styled.loadingContainer}>
                <Spinner />
                <p>검색 중...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className={styled.emptyContainer}>
                <div className={styled.emptyIcon}>🔍</div>
                <h3 className={styled.emptyTitle}>검색 결과가 없습니다</h3>
                <p className={styled.emptyDescription}>
                  &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
                  <br />
                  다른 검색어를 시도해보세요.
                </p>
              </div>
            ) : (
              <div className={styled.postsList}>
                {searchResults
                  .filter((post) => !showBookmarkOnly || post.isBookmarked)
                  .map((post) => (
                    <div key={post.communityId} className={styled.postItem}>
                      <CommunityCard
                        post={post}
                        onClick={() => handlePostClick(post.communityId)}
                      />
                      {post.communityTags && post.communityTags.length > 0 && (
                        <TagDisplay
                          tags={post.communityTags}
                          onTagClick={handleTagClick}
                        />
                      )}
                    </div>
                  ))}
              </div>
            )}
          </>
        ) : (
          // 일반 모드일 때 게시글 목록 표시
          <>
            {loading && posts.length === 0 ? (
              <div className={styled.loadingContainer}>
                <Spinner />
                <p>게시글을 불러오는 중...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className={styled.emptyContainer}>
                <div className={styled.emptyIcon}>🏊‍♂️</div>
                <h3 className={styled.emptyTitle}>아직 게시글이 없어요</h3>
                <p className={styled.emptyDescription}>
                  첫 번째 운동 기록을 공유해보세요!
                  <br />
                  동료들과 함께 성장해나가요.
                </p>
                <button
                  className={styled.emptyButton}
                  onClick={handleCreatePost}>
                  첫 게시글 작성하기
                </button>
              </div>
            ) : (
              <>
                <div className={styled.postsList}>
                  {posts
                    .filter((post) => !showBookmarkOnly || post.isBookmarked)
                    .map((post) => (
                      <div key={post.communityId} className={styled.postItem}>
                        <CommunityCard
                          post={post}
                          onClick={() => handlePostClick(post.communityId)}
                        />
                        {post.communityTags && post.communityTags.length > 0 && (
                          <TagDisplay
                            tags={post.communityTags}
                            onTagClick={handleTagClick}
                          />
                        )}
                      </div>
                    ))}
                </div>

                {hasMore && (
                  <div className={styled.loadMoreContainer}>
                    <button
                      className={styled.loadMoreButton}
                      onClick={handleLoadMore}
                      disabled={loading}>
                      {loading ? (
                        <>
                          <InlineLoader />
                          <span>로딩 중...</span>
                        </>
                      ) : (
                        '더 보기'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Link href="/community/create" className={styled.link}>
        <IconAdd />
      </Link>

      <BottomNav />
    </div>
  );
}
