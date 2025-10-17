import styles from './styles.module.scss';

export function CommunityDetailSkeleton() {
  return (
    <div className={styles.container}>
      {/* 헤더 스켈레톤 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.backButton} />
          <div className={styles.title} />
        </div>
      </div>

      <div className={styles.content}>
        {/* 작성자 정보 + 날짜 스켈레톤 */}
        <div className={styles.authorSection}>
          <div className={styles.authorInfo}>
            <div className={styles.profileImage} />
            <div className={styles.authorDetails}>
              <div className={styles.authorName} />
            </div>
          </div>
          <div className={styles.dateInfo}>
            <div className={styles.date} />
          </div>
        </div>

        {/* 게시글 제목 스켈레톤 */}
        <div className={styles.titleSection}>
          <div className={styles.postTitle} />
          <div className={styles.postTitleShort} />
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 게시글 내용 스켈레톤 */}
        <div className={styles.contentSection}>
          <div className={styles.contentLine} />
          <div className={styles.contentLine} />
          <div className={styles.contentLine} />
          <div className={styles.contentLineShort} />
        </div>

        {/* 구분선 */}
        <div className={styles.divider} />

        {/* 통계 정보 스켈레톤 */}
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statIcon} />
            <div className={styles.statValue} />
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon} />
            <div className={styles.statValue} />
          </div>
        </div>

        {/* 댓글 섹션 스켈레톤 */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <div className={styles.commentsTitle} />
            <div className={styles.sortDropdown} />
          </div>

          {/* 댓글 입력 스켈레톤 */}
          <div className={styles.commentInput}>
            <div className={styles.userAvatar} />
            <div className={styles.inputContainer}>
              <div className={styles.inputField} />
            </div>
            <div className={styles.submitButton} />
          </div>

          {/* 댓글 목록 스켈레톤 */}
          <div className={styles.commentsList}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.commentItem}>
                <div className={styles.commentAvatar} />
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor} />
                    <div className={styles.commentTime} />
                  </div>
                  <div className={styles.commentText}>
                    <div className={styles.commentTextLine} />
                    <div className={styles.commentTextLineShort} />
                  </div>
                  <div className={styles.commentActions}>
                    <div className={styles.likeButton} />
                    <div className={styles.replyButton} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


