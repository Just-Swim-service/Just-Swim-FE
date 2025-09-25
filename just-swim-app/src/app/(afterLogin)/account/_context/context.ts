import React, { SetStateAction } from 'react';
import { UserType } from '@types';

type ContextProps = {
  userToken: string | boolean;
  editable: boolean;
  userName: string;
  userBirth: string;
  userPhoneNumber: string;
  userType: UserType;
  profileImage: {
    fileName?: string | undefined;
    fileType?: string | undefined;
    fileURL?: string | undefined;
  };
  // 강사 전용 필드 (BE Instructor entity 기반)
  instructorWorkingLocation: string;
  instructorCareer: string;
  instructorHistory: string;
  instructorIntroduction: string;
  instructorCurriculum: string;
  instructorYoutubeLink: string;
  instructorInstagramLink: string;
  instructorFacebookLink: string;
  // 고객 전용 필드 (BE Customer entity 기반)
  customerNickname: string;

  setEditable: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
  setUserBirth: React.Dispatch<SetStateAction<string>>;
  setUserPhoneNumber: React.Dispatch<SetStateAction<string>>;
  setUserType: React.Dispatch<SetStateAction<UserType>>;
  setProfileImage: React.Dispatch<
    SetStateAction<{
      fileName?: string | undefined;
      fileType?: string | undefined;
      fileURL?: string | undefined;
    }>
  >;
  // 강사 전용 setter (BE Instructor entity 기반)
  setInstructorWorkingLocation: React.Dispatch<SetStateAction<string>>;
  setInstructorCareer: React.Dispatch<SetStateAction<string>>;
  setInstructorHistory: React.Dispatch<SetStateAction<string>>;
  setInstructorIntroduction: React.Dispatch<SetStateAction<string>>;
  setInstructorCurriculum: React.Dispatch<SetStateAction<string>>;
  setInstructorYoutubeLink: React.Dispatch<SetStateAction<string>>;
  setInstructorInstagramLink: React.Dispatch<SetStateAction<string>>;
  setInstructorFacebookLink: React.Dispatch<SetStateAction<string>>;
  // 고객 전용 setter (BE Customer entity 기반)
  setCustomerNickname: React.Dispatch<SetStateAction<string>>;
};

export const AccountContext = React.createContext<ContextProps>({
  userToken: '',
  editable: false,
  userName: '',
  userBirth: '',
  userPhoneNumber: '',
  userType: 'customer' as UserType,
  profileImage: {},
  // 강사 전용 필드 (BE Instructor entity 기반)
  instructorWorkingLocation: '',
  instructorCareer: '',
  instructorHistory: '',
  instructorIntroduction: '',
  instructorCurriculum: '',
  instructorYoutubeLink: '',
  instructorInstagramLink: '',
  instructorFacebookLink: '',
  // 고객 전용 필드 (BE Customer entity 기반)
  customerNickname: '',

  setEditable: () => {},
  setUserName: () => {},
  setUserBirth: () => {},
  setUserPhoneNumber: () => {},
  setUserType: () => {},
  setProfileImage: () => {},
  // 강사 전용 setter (BE Instructor entity 기반)
  setInstructorWorkingLocation: () => {},
  setInstructorCareer: () => {},
  setInstructorHistory: () => {},
  setInstructorIntroduction: () => {},
  setInstructorCurriculum: () => {},
  setInstructorYoutubeLink: () => {},
  setInstructorInstagramLink: () => {},
  setInstructorFacebookLink: () => {},
  // 고객 전용 setter (BE Customer entity 기반)
  setCustomerNickname: () => {},
});
