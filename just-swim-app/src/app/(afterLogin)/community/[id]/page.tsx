'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { BottomNav, HistoryBackHeader } from '@components';
import { getCommunityById, type CommunityPost } from '@apis';

import styled from './styles.module.scss';

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const communityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getCommunityById(communityId);
        setPost(response);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchPost();
    }
  }, [communityId]);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  if (loading) {
    return (
      <div className={styled.container}>
        <HistoryBackHeader title="게시글 상세" />
        <div className={styled.loadingContainer}>
          <p>게시글을 불러오는 중...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styled.container}>
        <HistoryBackHeader title="게시글 상세" />
        <div className={styled.errorContainer}>
          <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styled.container}>
      <HistoryBackHeader title="게시글 상세" />

      <main className={styled.content}>
        <article className={styled.post}>
          <header className={styled.header}>
            <div className={styled.userInfo}>
              <div className={styled.profileImage}>
                <img
                  src={post.user.profileImage || '/assets/no_profile.png'}
                  alt={post.user.name}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/no_profile.png';
                  }}
                />
              </div>
              <div className={styled.userDetails}>
                <span className={styled.userName}>{post.user.name}</span>
                <span className={styled.createdAt}>
                  {formatDate(post.communityCreatedAt)}
                </span>
              </div>
            </div>
          </header>

          <div className={styled.body}>
            <h1 className={styled.title}>{post.title}</h1>
            <div className={styled.content}>
              {post.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            {post.workoutData && (
              <div className={styled.workoutInfo}>
                <h3>운동 정보</h3>
                <div className={styled.workoutTags}>
                  {Object.entries(post.workoutData).map(([key, value]) => (
                    <span key={key} className={styled.tag}>
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <footer className={styled.footer}>
            <div className={styled.stats}>
              <div className={styled.statItem}>
                <span className={styled.statIcon}>👁</span>
                <span>{post.viewCount}</span>
              </div>
              <div className={styled.statItem}>
                <span className={styled.statIcon}>❤</span>
                <span>{post.likeCount}</span>
              </div>
              <div className={styled.statItem}>
                <span className={styled.statIcon}>💬</span>
                <span>{post.commentCount}</span>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <BottomNav />
    </div>
  );
}
