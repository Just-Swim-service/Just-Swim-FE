'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { IconAdd } from '@assets';
import { BottomNav, UserIconHeader } from '@components';
import { CommunityCard } from '@components';
import { InlineLoader, Spinner } from '@components';
import { getCommunities, type CommunityPost } from '@apis';

import styled from './styles.module.scss';

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const response = await getCommunities(pageNum, 10);

      if (pageNum === 1) {
        setPosts(response.communities);
      } else {
        setPosts((prev) => [...prev, ...response.communities]);
      }

      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      // 에러 발생 시 빈 배열로 설정
      if (pageNum === 1) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  return (
    <div className={styled.container}>
      <UserIconHeader title="커뮤니티" />

      <div className={styled.content}>
        {loading && posts.length === 0 ? (
          <div className={styled.loadingContainer}>
            <Spinner />
            <p>게시글을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className={styled.postsList}>
              {posts.map((post) => (
                <CommunityCard
                  key={post.communityId}
                  post={post}
                  onClick={() => handlePostClick(post.communityId)}
                />
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

      <div className={styled.fab}>
        <button
          className={styled.fabButton}
          onClick={handleCreatePost}
          aria-label="게시글 작성">
          <IconAdd width={24} height={24} />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
