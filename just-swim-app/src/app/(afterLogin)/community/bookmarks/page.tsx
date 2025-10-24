'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { BottomNav, Header } from '@components';
import { getUserBookmarks, type CommunityPost } from '@apis';
import { IconBookmark } from '@assets';

import styled from './styles.module.scss';

export default function BookmarksPage() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    fetchBookmarks();
  }, [page]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await getUserBookmarks(page, limit);

      if (page === 1) {
        setBookmarks(response.bookmarks);
      } else {
        setBookmarks((prev) => [...prev, ...response.bookmarks]);
      }

      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('북마크 조회 실패:', error);
      setError('북마크를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (communityId: number) => {
    router.push(`/community/${communityId}`);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  if (loading && page === 1) {
    return (
      <div className={styled.container}>
        <Header title="북마크" routerBackUrl="/community" />
        <div className={styled.loading}>
          <p>북마크를 불러오는 중...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styled.container}>
        <Header title="북마크" routerBackUrl="/community" />
        <div className={styled.error}>
          <p>{error}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styled.container}>
      <Header title="북마크" routerBackUrl="/community" />

      <div className={styled.bookmarks_container}>
        {bookmarks.length === 0 ? (
          <div className={styled.empty_state}>
            <IconBookmark width={48} height={48} fill="white" />
            <h3>북마크한 게시글이 없습니다</h3>
            <p>마음에 드는 게시글을 북마크해보세요!</p>
          </div>
        ) : (
          <>
            <div className={styled.bookmarks_list}>
              {bookmarks.map((post) => (
                <div
                  key={post.communityId}
                  className={styled.bookmark_card}
                  onClick={() => handlePostClick(post.communityId)}>
                  <div className={styled.card_content}>
                    <div className={styled.card_header}>
                      <h3 className={styled.title}>{post.title}</h3>
                      <IconBookmark width={20} height={20} fill="#4A90E2" />
                    </div>

                    <p className={styled.content}>
                      {post.content.length > 100
                        ? `${post.content.substring(0, 100)}...`
                        : post.content}
                    </p>

                    <div className={styled.card_footer}>
                      <div className={styled.author_info}>
                        <img
                          src={
                            post.user.profileImage || '/assets/no_profile.png'
                          }
                          alt={post.user.name}
                          className={styled.author_avatar}
                          onError={(e) => {
                            e.currentTarget.src = '/assets/no_profile.png';
                          }}
                        />
                        <span className={styled.author_name}>
                          {post.user.name}
                        </span>
                      </div>

                      <div className={styled.meta_info}>
                        <span className={styled.date}>
                          {formatDate(post.communityCreatedAt)}
                        </span>
                        <div className={styled.stats}>
                          <span>👁 {post.viewCount}</span>
                          <span>❤ {post.likeCount}</span>
                          <span>💬 {post.commentCount}</span>
                        </div>
                      </div>
                    </div>

                    {post.communityTags && post.communityTags.length > 0 && (
                      <div className={styled.tags}>
                        {post.communityTags.slice(0, 3).map((tagObj, index) => (
                          <span key={index} className={styled.tag}>
                            #{tagObj.tag.tagName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                className={styled.load_more_button}
                onClick={handleLoadMore}
                disabled={loading}>
                {loading ? '로딩 중...' : '더 보기'}
              </button>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
