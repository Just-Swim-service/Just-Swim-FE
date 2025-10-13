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
  toggleCommentLike,
  toggleCommunityLike,
  type CommunityPost,
  type CommunityComment,
} from '@apis';
import { CommunityDetailSkeleton } from './_components/communityDetailSkeleton';
import { getMyProfile } from '@apis';
import { IconKebabMenu, IconTrashcan, IconSetting } from '@assets';
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
  const [forceUpdate, setForceUpdate] = useState(0); // 강제 리렌더링용
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // 답글 작성 중인 댓글 ID
  const [replyContent, setReplyContent] = useState(''); // 답글 내용
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set()); // 펼쳐진 대댓글 목록

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
    console.log('Kebab clicked! Current showDropdown:', showDropdown);
    setShowDropdown(!showDropdown);
    console.log('New showDropdown will be:', !showDropdown);
  };

  const handleOutsideClick = () => {
    setShowDropdown(false);
  };

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      setCommentError(null);

      await createComment(communityId, { content: newComment });

      // 댓글 작성 후 댓글 목록을 다시 가져와서 최신 상태로 업데이트
      const updatedComments = await getComments(communityId);
      setComments(updatedComments || []);

      // 입력 필드 초기화
      setNewComment('');

      // textarea 높이 초기화
      const textarea = document.querySelector(
        `.${styled.comment_text_input}`,
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }

      // 게시글의 댓글 수 업데이트 (일반 댓글만 카운트)
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      setCommentError('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setNewComment(e.target.value);

    // textarea 높이 자동 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleCommentKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    // Ctrl + Enter 또는 Cmd + Enter로 댓글 전송
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitComment();
    }
    // Enter만 누르면 줄바꿈 (기본 동작 허용)
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: number) => {
    try {
      const result = await toggleCommentLike(commentId);

      // 댓글 목록에서 해당 댓글의 좋아요 상태 업데이트 - 직접 상태 업데이트
      const currentComments = [...comments];
      const commentIndex = currentComments.findIndex(
        (c) => c.commentId === commentId,
      );

      if (commentIndex !== -1) {
        const currentComment = currentComments[commentIndex];

        const newLikeCount = result.isLiked
          ? currentComment.likeCount + 1
          : Math.max(0, currentComment.likeCount - 1);

        currentComments[commentIndex] = {
          ...currentComment,
          likeCount: newLikeCount,
        };

        setComments(currentComments);
      }

      // 강제 리렌더링 트리거
      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  // 답글 버튼 클릭 핸들러
  const handleReplyClick = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyContent('');
    setCommentError(null); // 에러 상태 초기화
  };

  // 대댓글 접기/펼치기 핸들러
  const toggleReplies = (commentId: number) => {
    const newExpandedReplies = new Set(expandedReplies);
    if (newExpandedReplies.has(commentId)) {
      newExpandedReplies.delete(commentId);
    } else {
      newExpandedReplies.add(commentId);
    }
    setExpandedReplies(newExpandedReplies);
  };

  // 답글 작성 핸들러
  const handleSubmitReply = async (parentCommentId: number) => {
    if (!replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      setCommentError(null);

      await createComment(communityId, {
        content: replyContent,
        parentCommentId: parentCommentId,
      });

      // 답글 작성 후 댓글 목록을 다시 가져와서 최신 상태로 업데이트
      const updatedComments = await getComments(communityId);
      setComments(updatedComments || []);

      // 답글 입력 필드 초기화
      setReplyContent('');
      setReplyingTo(null);

      // 답글은 댓글 수에 포함되지 않음 (대댓글이므로)
      // 게시글의 댓글 수는 변경하지 않음
    } catch (error) {
      console.error('답글 작성 실패:', error);
      setCommentError('답글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // 답글 입력 변경 핸들러
  const handleReplyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);

    // textarea 높이 자동 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // 답글 키보드 이벤트 핸들러
  const handleReplyKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    parentCommentId: number,
  ) => {
    // Ctrl + Enter 또는 Cmd + Enter로 답글 전송
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitReply(parentCommentId);
    }
  };

  // 게시글 좋아요 토글
  const handleCommunityLike = async () => {
    if (!post) return;

    try {
      const result = await toggleCommunityLike(post.communityId);

      // 게시글의 좋아요 수 업데이트 - 직접 상태 업데이트
      const currentPost = post;
      const newLikeCount = result.isLiked
        ? currentPost.likeCount + 1
        : Math.max(0, currentPost.likeCount - 1);

      setPost({
        ...currentPost,
        likeCount: newLikeCount,
      });

      // 강제 리렌더링 트리거
      setForceUpdate((prev) => prev + 1);
    } catch (error) {
      console.error('게시글 좋아요 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className={styled.container}>
        <Header title="게시글 상세" routerBackUrl="/community" />
        <CommunityDetailSkeleton />
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

                {/* 항상 보이는 테스트 드롭다운 */}
                <div
                  id="debug-dropdown-menu-always"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    zIndex: 999,
                    minWidth: '120px',
                    backgroundColor: 'white',
                    border: '3px solid red',
                    borderRadius: '8px',
                    boxShadow:
                      '0 8px 24px rgba(255, 0, 0, 0.5), 0 4px 12px rgba(255, 0, 0, 0.3)',
                    overflow: 'hidden',
                    marginTop: '4px',
                  }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '15px',
                      color: '#5c5e62',
                    }}>
                    <IconSetting width={16} height={16} fill="#666" />
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '15px',
                      color: '#5c5e62',
                      borderTop: '1px solid #ebecee',
                    }}>
                    <IconTrashcan width={16} height={16} fill="#FF4D4D" />
                    삭제
                  </button>
                </div>

                {/* 원래 조건부 렌더링 */}
                {showDropdown && (
                  <>
                    {console.log(
                      'Rendering dropdown menu! showDropdown is true',
                    )}
                    <div
                      className={styled.dropdown_overlay}
                      onClick={handleOutsideClick}
                    />
                    <div
                      id="debug-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        zIndex: 999,
                        minWidth: '120px',
                        backgroundColor: 'white',
                        border: '3px solid red',
                        borderRadius: '8px',
                        boxShadow:
                          '0 8px 24px rgba(255, 0, 0, 0.5), 0 4px 12px rgba(255, 0, 0, 0.3)',
                        overflow: 'hidden',
                        marginTop: '4px',
                      }}>
                      <button
                        onClick={handleEdit}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#5c5e62',
                        }}>
                        <IconSetting width={16} height={16} fill="#666" />
                        수정
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#5c5e62',
                          borderTop: '1px solid #ebecee',
                        }}>
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

        {/* 게시글 제목 */}
        <div className={styled.detail_title}>
          <h1>{post.title}</h1>
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
          <div
            className={`${styled.stat_item} ${styled.like_stat_item}`}
            onClick={handleCommunityLike}>
            <span className={styled.stat_icon}>❤</span>
            <span className={styled.stat_value}>{post.likeCount}</span>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className={styled.comments_section}>
          <div className={styled.comments_header}>
            <h3 className={styled.comments_title}>
              댓글{' '}
              {
                comments.filter(
                  (comment) =>
                    !comment.parentComment && !comment.parentCommentId,
                ).length
              }
              개
            </h3>
          </div>

          {/* 에러 메시지 */}
          {commentError && (
            <div className={styled.error_message}>
              <span>{commentError}</span>
              <button
                onClick={() => setCommentError(null)}
                className={styled.error_close}>
                ✕
              </button>
            </div>
          )}

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
              <textarea
                placeholder="댓글 추가..."
                className={styled.comment_text_input}
                value={newComment}
                onChange={handleCommentInputChange}
                onKeyDown={handleCommentKeyPress}
                disabled={isSubmittingComment}
                rows={1}
              />
            </div>
            <button
              className={styled.submit_button}
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmittingComment}
              type="button">
              {isSubmittingComment ? '전송 중...' : '전송'}
            </button>
          </div>

          {/* 댓글 목록 */}
          <div className={styled.comments_list}>
            {(() => {
              const mainComments = comments.filter(
                (comment) => !comment.parentComment && !comment.parentCommentId,
              );

              if (mainComments.length === 0) {
                return (
                  <div className={styled.no_comments}>
                    <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
                  </div>
                );
              } else {
                return mainComments.map((comment) => (
                  <div key={comment.commentId} className={styled.comment_item}>
                    <div className={styled.comment_avatar}>
                      <img
                        src={
                          comment.user.profileImage || '/assets/no_profile.png'
                        }
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
                      <div className={styled.comment_text}>
                        {comment.content.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            {index < comment.content.split('\n').length - 1 && (
                              <br />
                            )}
                          </span>
                        ))}
                      </div>
                      <div className={styled.comment_actions}>
                        <button
                          className={styled.like_button}
                          onClick={() => handleCommentLike(comment.commentId)}>
                          <span>👍</span>
                          <span>{comment.likeCount}</span>
                        </button>
                        <button
                          className={styled.reply_button}
                          onClick={() => handleReplyClick(comment.commentId)}>
                          답글
                        </button>
                        {/* 대댓글 개수 표시 및 접기/펼치기 버튼 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <button
                            className={styled.toggle_replies_button}
                            onClick={() => toggleReplies(comment.commentId)}>
                            {expandedReplies.has(comment.commentId) ? (
                              <>
                                <span>↑</span>
                                <span>답글 숨기기</span>
                              </>
                            ) : (
                              <>
                                <span>↓</span>
                                <span>답글 {comment.replies.length}개</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* 답글 입력 영역 */}
                      {replyingTo === comment.commentId && (
                        <div className={styled.reply_input}>
                          <div className={styled.reply_user_avatar}>
                            <img
                              src={
                                profileInfo?.profileImage ||
                                '/assets/no_profile.png'
                              }
                              alt="프로필"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/no_profile.png';
                              }}
                            />
                          </div>
                          <div className={styled.reply_input_container}>
                            <textarea
                              placeholder="답글 추가..."
                              className={styled.reply_text_input}
                              value={replyContent}
                              onChange={handleReplyInputChange}
                              onKeyDown={(e) =>
                                handleReplyKeyPress(e, comment.commentId)
                              }
                              disabled={isSubmittingReply}
                              rows={1}
                            />
                          </div>
                          <button
                            className={styled.reply_submit_button}
                            onClick={() => handleSubmitReply(comment.commentId)}
                            disabled={!replyContent.trim() || isSubmittingReply}
                            type="button">
                            {isSubmittingReply ? '전송 중...' : '전송'}
                          </button>
                        </div>
                      )}

                      {/* 대댓글 목록 - 접기/펼치기 기능 */}
                      {comment.replies &&
                        comment.replies.length > 0 &&
                        expandedReplies.has(comment.commentId) && (
                          <div className={styled.replies_list}>
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.commentId}
                                className={styled.reply_item}>
                                <div className={styled.reply_avatar}>
                                  <img
                                    src={
                                      reply.user.profileImage ||
                                      '/assets/no_profile.png'
                                    }
                                    alt={reply.user.userName}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        '/assets/no_profile.png';
                                    }}
                                  />
                                </div>
                                <div className={styled.reply_content}>
                                  <div className={styled.reply_header}>
                                    <span className={styled.reply_author}>
                                      {reply.user.userName}
                                    </span>
                                    <span className={styled.reply_time}>
                                      {formatDistanceToNow(
                                        new Date(reply.commentCreatedAt),
                                        {
                                          addSuffix: true,
                                          locale: ko,
                                        },
                                      )}
                                    </span>
                                  </div>
                                  <div className={styled.reply_text}>
                                    {reply.content
                                      .split('\n')
                                      .map((line, index) => (
                                        <span key={index}>
                                          {line}
                                          {index <
                                            reply.content.split('\n').length -
                                              1 && <br />}
                                        </span>
                                      ))}
                                  </div>
                                  <div className={styled.reply_actions}>
                                    <button
                                      className={styled.like_button}
                                      onClick={() =>
                                        handleCommentLike(reply.commentId)
                                      }>
                                      <span>👍</span>
                                      <span>{reply.likeCount}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ));
              }
            })()}
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
