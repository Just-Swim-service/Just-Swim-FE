export interface MemberProps {
  userId: number;
  profileImage: string;
  name: string;
  birth: string;
  email: string;
  phoneNumber: string;
  lectures: UserLectureProps[];
  feedback: UserFeedbackProps[];
}

export interface UserLectureProps {
  lectureId: string;
  lectureTitle: string;
  lectureContent: string;
  lectureLocation: string;
  lectureColor: string;
  lectureDays: string;
  lectureTime: string;
}

export interface UserFeedbackProps {
  feedbackId: string;
  feedbackDate: string;
  feedbackType: string;
  feedbackContent: string;
  images: ImageProps[];
}

export interface ImageProps {
  imagePath: string;
}
