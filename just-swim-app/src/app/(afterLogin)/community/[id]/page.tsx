'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { BottomNav, HistoryBackHeader } from '@components';
import {
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  type CommunityPost,
} from '@apis';
import { getMyProfile } from '@apis';
import { IconSetting, IconTrashcan } from '@assets';
import { DeleteConfirmModalProps } from '@types';

import styled from './styles.module.scss';

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styled.modal_overlay}>
      <div className={styled.delete_modal}>
        <h3>게시글을 삭제하시겠습니까?</h3>
        <p>
          삭제된 게시글은 복구되지 않으며,
          <br />
          모든 댓글과 좋아요도 함께 삭제됩니다.
        </p>
        <form>
          <input
            type="checkbox"
            id="confirmation-checkbox"
            style={{ marginRight: '8px' }}
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="confirmation-checkbox">유의사항을 확인했습니다.</label>
        </form>
        <div className={styled.modal_buttons}>
          <button
            className={styled.button_cancel}
            onClick={onCancel}
            disabled={isDeleting}>
            취소
          </button>
          <button
            className={styled.button_delete}
            onClick={handleConfirm}
            disabled={!isChecked || isDeleting}>
            {isDeleting ? '삭제 중...' : '게시글 삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const communityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 현재 사용자 정보와 게시글 정보를 병렬로 가져오기
        const [profileResponse, postResponse] = await Promise.all([
          getMyProfile(),
          getCommunityById(communityId),
        ]);

        setCurrentUserId(parseInt(profileResponse.data.data.userId));
        setPost(postResponse);
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError('게시글을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchData();
    }
  }, [communityId]);

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  // 작성자 권한 체크
  const isAuthor = currentUserId && post && currentUserId === post.user.userId;

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!post) return;

    try {
      setIsDeleting(true);
      await deleteCommunity(post.communityId);
      alert('게시글이 삭제되었습니다.');
      router.push('/community');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/community/edit/${communityId}`);
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

        {/* 수정/삭제 버튼 (작성자만 표시) */}
        {isAuthor && (
          <div className={styled.action_buttons}>
            <button className={styled.edit_button} onClick={handleEdit}>
              <IconSetting width={20} height={20} fill="#666" />
              수정
            </button>
            <button
              className={styled.delete_button}
              onClick={() => setShowDeleteModal(true)}>
              <IconTrashcan width={20} height={20} fill="#FF4D4D" />
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />

      <BottomNav />
    </div>
  );
}
