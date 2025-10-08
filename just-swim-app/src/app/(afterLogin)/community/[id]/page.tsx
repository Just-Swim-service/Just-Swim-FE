'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

import { BottomNav, Header } from '@components';
import {
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  getComments,
  createComment,
  type CommunityPost,
  type CommunityComment,
} from '@apis';
import { getMyProfile } from '@apis';
import {
  IconKebabMenu,
  IconTrashcan,
  IconSetting,
  IconArrowDown,
} from '@assets';
import { DeleteConfirmModalProps } from '@types';
import { useUserStore } from '@store';

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
  const { profileInfo } = useUserStore();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const communityId = parseInt(params.id as string);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 현재 사용자 정보, 게시글 정보, 댓글 정보를 병렬로 가져오기
        const [profileResponse, postResponse, commentsResponse] =
          await Promise.all([
            getMyProfile(),
            getCommunityById(communityId),
            getComments(communityId),
          ]);

        setCurrentUserId(parseInt(profileResponse.data.data.userId));
        setPost(postResponse);
        setComments(commentsResponse || []);
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
    setShowDropdown(false);
    router.push(`/community/edit/${communityId}`);
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const handleKebabClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOutsideClick = () => {
    setShowDropdown(false);
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await createComment(communityId, { content: newComment });

      // 댓글 목록 새로고침
      const commentsResponse = await getComments(communityId);
      setComments(commentsResponse || []);

      // 입력 필드 초기화
      setNewComment('');

      // 게시글의 댓글 수 업데이트
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  if (loading) {
    return (
      <div className={styled.container}>
        <Header title="게시글 상세" routerBackUrl="/community" />
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
        <Header title="게시글 상세" routerBackUrl="/community" />
        <div className={styled.errorContainer}>
          <p>{error || '게시글을 찾을 수 없습니다.'}</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styled.container}>
      <Header title="게시글 상세" routerBackUrl="/community" />

      <div className={styled.detail_container}>
        {/* 게시글 제목 */}
        <div className={styled.detail_title}>
          <h1>{post.title}</h1>
        </div>

        {/* 작성자 정보 + 날짜 + 케밥 메뉴 통합 */}
        <div className={styled.post_header}>
          {/* 왼쪽: 작성자 정보 */}
          <div className={styled.author_section}>
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

          {/* 오른쪽: 날짜 + 케밥 메뉴 */}
          <div className={styled.actions_section}>
            <div className={styled.date_info}>
              <span className={styled.icon}>📅</span>
              {formatDate(post.communityCreatedAt)}
            </div>

            {/* 케밥 메뉴 (작성자만 표시) */}
            {isAuthor && (
              <div className={styled.kebab_menu_container}>
                <button
                  className={styled.kebab_button}
                  onClick={handleKebabClick}>
                  <IconKebabMenu width={20} height={20} fill="#666" />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className={styled.dropdown_overlay}
                      onClick={handleOutsideClick}
                    />
                    <div className={styled.dropdown_menu}>
                      <button
                        className={styled.dropdown_item}
                        onClick={handleEdit}>
                        <IconSetting width={16} height={16} fill="#666" />
                        수정
                      </button>
                      <button
                        className={styled.dropdown_item}
                        onClick={handleDeleteClick}>
                        <IconTrashcan width={16} height={16} fill="#FF4D4D" />
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
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
            <span className={styled.stat_value}>{post.viewCount}</span>
          </div>
          <div className={styled.stat_item}>
            <span className={styled.stat_icon}>❤</span>
            <span className={styled.stat_value}>{post.likeCount}</span>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className={styled.comments_section}>
          <div className={styled.comments_header}>
            <h3 className={styled.comments_title}>댓글 {post.commentCount}개</h3>
            <div className={styled.sort_dropdown}>
              <span>정렬 기준</span>
              <IconArrowDown width={16} height={16} fill="#666" />
            </div>
          </div>

          {/* 댓글 입력 */}
          <div className={styled.comment_input}>
            <div className={styled.user_avatar}>
              <img
                src={profileInfo?.profileImage || '/assets/no_profile.png'}
                alt="프로필"
                onError={(e) => {
                  e.currentTarget.src = '/assets/no_profile.png';
                }}
              />
            </div>
            <div className={styled.input_container}>
              <input
                type="text"
                placeholder="댓글 추가..."
                className={styled.comment_text_input}
                value={newComment}
                onChange={handleCommentInputChange}
                onKeyPress={handleCommentKeyPress}
                disabled={isSubmittingComment}
              />
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className={styled.comments_list}>
            {comments.length === 0 ? (
              <div className={styled.no_comments}>
                <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentId} className={styled.comment_item}>
                  <div className={styled.comment_avatar}>
                    <img
                      src={comment.user.profileImage || '/assets/no_profile.png'}
                      alt={comment.user.userName}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/no_profile.png';
                      }}
                    />
                  </div>
                  <div className={styled.comment_content}>
                    <div className={styled.comment_header}>
                      <span className={styled.comment_author}>
                        {comment.user.userName}
                      </span>
                      <span className={styled.comment_time}>
                        {formatDistanceToNow(
                          new Date(comment.commentCreatedAt),
                          {
                            addSuffix: true,
                            locale: ko,
                          },
                        )}
                      </span>
                    </div>
                    <div className={styled.comment_text}>{comment.content}</div>
                    <div className={styled.comment_actions}>
                      <button className={styled.like_button}>
                        <span>👍</span>
                        <span>{comment.likeCount}</span>
                      </button>
                      <button className={styled.reply_button}>답글</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
