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

      <div className={styled.detail_container}>
        {/* 게시글 날짜 정보 */}
        <div className={styled.community_date}>
          <span className={styled.icon}>📅</span>
          {formatDate(post.communityCreatedAt)}
        </div>

        {/* 게시글 제목 */}
        <div className={styled.detail_title}>
          <h1>{post.title}</h1>
        </div>

        {/* 작성자 정보 */}
        <div className={styled.author_info}>
          <div className={styled.author_profile}>
            <div className={styled.profile_image}>
              <img
                src={post.user.profileImage || '/assets/no_profile.png'}
                alt={post.user.name}
                onError={(e) => {
                  e.currentTarget.src = '/assets/no_profile.png';
                }}
              />
            </div>
            <div className={styled.author_details}>
              <span className={styled.author_name}>{post.user.name}</span>
              <span className={styled.post_time}>
                {formatDate(post.communityCreatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styled.community_divider} />

        {/* 게시글 내용 */}
        <div className={styled.community_content}>
          <div className={styled.content_text}>
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          {/* 운동 정보 */}
          {post.workoutData && (
            <div className={styled.workout_section}>
              <h3>운동 정보</h3>
              <div className={styled.workout_tags}>
                {Object.entries(post.workoutData).map(([key, value]) => (
                  <span key={key} className={styled.workout_tag}>
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className={styled.community_divider} />

        {/* 통계 정보 */}
        <div className={styled.community_stats}>
          <div className={styled.stat_item}>
            <span className={styled.stat_icon}>👁</span>
            <span className={styled.stat_label}>조회</span>
            <span className={styled.stat_value}>{post.viewCount}</span>
          </div>
          <div className={styled.stat_item}>
            <span className={styled.stat_icon}>❤</span>
            <span className={styled.stat_label}>좋아요</span>
            <span className={styled.stat_value}>{post.likeCount}</span>
          </div>
          <div className={styled.stat_item}>
            <span className={styled.stat_icon}>💬</span>
            <span className={styled.stat_label}>댓글</span>
            <span className={styled.stat_value}>{post.commentCount}</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
