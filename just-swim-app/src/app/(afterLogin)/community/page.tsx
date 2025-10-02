'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { IconAdd } from '@assets';
import { BottomNav, UserIconHeader } from '@components';
import { CommunityCard } from '@components';
import { InlineLoader, Spinner } from '@components';
import { getCommunities, type CommunityPost } from '@apis';

import styled from './styles.module.scss';
import Link from 'next/link';

export default function CommunityPage() {
  console.log('=== CommunityPage 컴포넌트가 실행됨! ==='); // 디버깅용

  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log('CommunityPage posts:', posts); // 디버깅용

  const fetchPosts = async (pageNum: number = 1) => {
    console.log('=== fetchPosts 함수 시작! ===', pageNum); // 디버깅용
    try {
      setLoading(true);
      console.log('=== getCommunities 호출 전 ==='); // 디버깅용
      const response = await getCommunities(pageNum, 10);
      console.log('=== getCommunities 응답 받음 ===', response); // 디버깅용

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
    console.log('=== useEffect 실행됨! fetchPosts 호출 ==='); // 디버깅용
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

      <Link href="/community/create" className={styled.link}>
        <IconAdd />
      </Link>

      <BottomNav />
    </div>
  );
}
