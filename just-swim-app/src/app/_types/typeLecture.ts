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
  members?: {
    userId: string;
    name: string;
    profileImage: string;
  }[];
  instructor: {
    instructorName: string;
    instructorProfileImage: string;
  };
}

export interface LectureDetailProps extends LectureProps {
  instructor: {
    instructorName: string;
    instructorProfileImage: string;
  };
}

export interface LectureViewProps extends LectureBasicProps {
  lectureId: string;
  isPastLecture: boolean;
  members?: {
    userId: number;
    name: string;
    profileImage: string | null;
  }[];
  instructor: {
    instructorName: string;
    instructorProfileImage: string;
  }[];
}

export interface ScheduleSummary {
  date: string;
  day: string;
  lectures: LectureProps[];
}

export interface LectureMembersProps {
  memberId: string;
  userId: number;
  lectureTitle: string;
  lectureId: string;
  nickName: string;
  name: string;
  profileImage: string;
}

export interface LectureQRCodeProps {
  lectureTitle: string;
  lectureContent: string;
  lectureQRCode: string;
}
