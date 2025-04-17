export interface FeedbackProps {
  feedbackId: string;
  feedbackType: string;
  feedbackDate: string;
  feedbackContent: string;
  lectureTitle: string;
  lectureColor: string;
  feedbackCreatedAt: string;
  instructor: {
    instructorUserId: string;
    instructorName: string;
    instructorProfileImage: string | null;
  }[];
  members: Members[];
}

export interface Members {
  lectureTitle: string;
  memberUserId: string;
  memberProfileImage: string;
  memberName: string;
}

export interface FeedbackInfo {
  feedbackContent: string;
  feedbackDate: string;
  feedbackId: string;
  feedbackType: string;
  feedbackCreatedAt: string;
  feedbackLink: string;
  images: [{ imagePath: string }];
  instructor: {
    instructorName: string;
    instructorProfileImage: string;
    instructorUserId: string;
  };
}
