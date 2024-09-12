export interface FeedbackProps {
  feedbackId: string;
  feedbackType: string;
  feedbackDate: string;
  feedbackContent: string;
  lectureTitle: string;
  feedbackCreatedAt: string;
  instructor: {
    instructorUserId: string;
    instructorName: string;
    instructorProfileImage: string | null;
  }[];
  feedbackTargetList: Members[];
}

export interface Members {
  lectureTitle: string;
  memberUserId: string;
  memberProfileImage: string;
  memberNickname: string | null;
  // swagger 보니까 nickname이 넘어오는데 name이 넘어와야 할 것 같음
  // 현재 null로 넘어오기 때문에 확인 요망
}
