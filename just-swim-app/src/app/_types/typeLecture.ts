export interface LectureBasicProps {
  lectureTitle: string;
  lectureContent: string;
  lectureTime: string;
  lectureDays: string;
  lectureLocation: string;
  lectureColor: string;
  lectureQRCode: string;
  lectureEndDate: string;
}

export interface LectureProps extends LectureBasicProps {
  lectureId: string;
  lectureMembers?: {
    memberUserId: number;
    memberProfileImage: string;
  }[];
}

export interface LectureViewProps extends LectureBasicProps {
  lectureId: string;
  isPastLecture: boolean;
  members?: {
    memberUserId: number;
    memberProfileImage: string;
  }[];
}

export interface ScheduleSummary {
  date: string;
  day: string;
  lectures: LectureProps[];
}
