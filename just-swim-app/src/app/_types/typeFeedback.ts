export interface FeedbackProps {
  feedbackId: string;
  feedbackType: string;
  feedbackDate: string;
  feedbackContent: string;
  lectureTitle: string;
  feedbackCreatedAt: string;
  //   members: {
  //     memberUserId: string;
  //     memberProfileImage: string;
  //     // swagger 보니까 nickname이 넘어오는데 name이 넘어와야 할 것 같음
  //     // 현재 null로 넘어오기 때문에 확인 요망
  //     memberNickname: string | null;
  //   }[];
  members: Members[];
}

export interface Members {
  memberUserId: string;
  memberProfileImage: string;
  // swagger 보니까 nickname이 넘어오는데 name이 넘어와야 할 것 같음
  // 현재 null로 넘어오기 때문에 확인 요망
  memberNickname: string | null;
}

export interface FeedbackIndo {
  feedbackContetn: string;
  feedbackDate: string;
  feedbackId: string;
  feedbackType: string;
  images: [];
  instructor: {
    instructorName: string;
    instructorProfileImage: string;
    instructorUserId: string;
  };
}
