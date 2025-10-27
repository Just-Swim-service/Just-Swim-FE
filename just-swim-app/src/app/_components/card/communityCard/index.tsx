'use client';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type CommunityPost } from '@apis';
import { IconBookmark, IconBookmarkFilled } from '@assets';

import styled from './styles.module.scss';

interface CommunityCardProps {
  post: CommunityPost;
  onClick: () => void;
}

export function CommunityCard({ post, onClick }: CommunityCardProps) {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className={styled.card} onClick={onClick}>
      <div className={styled.header}>
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
        <div className={styled.rightSection}>
          {post.isBookmarked && (
            <div className={styled.bookmarkIcon}>
              <IconBookmarkFilled width={20} height={20} />
            </div>
          )}
          {post.category && (
            <span className={styled.categoryBadge}>{post.category}</span>
          )}
        </div>
      </div>

      <div className={styled.content}>
        <h3 className={styled.title}>{post.title}</h3>
        <p className={styled.description}>{truncateContent(post.content)}</p>

        {post.workoutData && (
          <div className={styled.workoutInfo}>
            <div className={styled.workoutTags}>
              {post.workoutData.workoutType && (
                <span className={styled.tag}>
                  {post.workoutData.workoutType}
                </span>
              )}
              {post.workoutData.duration && (
                <span className={styled.tag}>{post.workoutData.duration}</span>
              )}
              {post.workoutData.distance && (
                <span className={styled.tag}>{post.workoutData.distance}</span>
              )}
            </div>
          </div>
        )}

        {/* 이미지/동영상 썸네일 */}
        {post.images && post.images.length > 0 && (
          <div className={styled.mediaThumbnails}>
            {post.images.slice(0, 4).map((image, index) => (
              <div key={image.imageId} className={styled.thumbnailItem}>
                {image.fileType === 'video' ? (
                  <div className={styled.videoThumbnail}>
                    {image.thumbnailPath ? (
                      <img
                        src={image.thumbnailPath}
                        alt={`동영상 ${index + 1}`}
                        className={styled.thumbnailImage}
                      />
                    ) : (
                      <video
                        src={image.imagePath}
                        className={styled.thumbnailImage}
                      />
                    )}
                    <div className={styled.playIcon}>▶</div>
                  </div>
                ) : (
                  <img
                    src={image.imagePath}
                    alt={image.fileName || `이미지 ${index + 1}`}
                    className={styled.thumbnailImage}
                  />
                )}
              </div>
            ))}
            {post.images.length > 4 && (
              <div className={styled.moreImagesOverlay}>
                +{post.images.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styled.footer}>
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
      </div>
    </div>
  );
}
