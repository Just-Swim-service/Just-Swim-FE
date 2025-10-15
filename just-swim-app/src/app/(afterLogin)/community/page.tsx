'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { IconAdd } from '@assets';
import { BottomNav, UserIconHeader } from '@components';
import { CommunityCard } from '@components';
import { InlineLoader, Spinner } from '@components';
import { CategoryFilter, TagDisplay } from '@components';
import { getCommunities, type CommunityPost, type CategoryType } from '@apis';

import styled from './styles.module.scss';
import Link from 'next/link';

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  // 필터가 변경될 때마다 첫 페이지부터 다시 조회
  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [selectedCategory, selectedTags]);

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

  return (
    <div className={styled.container}>
      <UserIconHeader title="커뮤니티" />

      {/* 카테고리 필터 */}
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

      <div className={styled.content}>
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
            <button className={styled.emptyButton} onClick={handleCreatePost}>
              첫 게시글 작성하기
            </button>
          </div>
        ) : (
          <>
            <div className={styled.postsList}>
              {posts.map((post) => (
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
      </div>

      <Link href="/community/create" className={styled.link}>
        <IconAdd />
      </Link>

      <BottomNav />
    </div>
  );
}
