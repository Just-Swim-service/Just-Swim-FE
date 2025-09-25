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
  // 강사 전용 필드
  instructorIntroduction: string;
  instructorExperience: string;
  instructorSpecialties: string[];
  instructorCertifications: string[];
  // 고객 전용 필드
  customerSwimmingLevel: string;
  customerPreferredStyles: string[];
  customerAllergies: string;
  customerEmergencyContact: string;

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
  // 강사 전용 setter
  setInstructorIntroduction: React.Dispatch<SetStateAction<string>>;
  setInstructorExperience: React.Dispatch<SetStateAction<string>>;
  setInstructorSpecialties: React.Dispatch<SetStateAction<string[]>>;
  setInstructorCertifications: React.Dispatch<SetStateAction<string[]>>;
  // 고객 전용 setter
  setCustomerSwimmingLevel: React.Dispatch<SetStateAction<string>>;
  setCustomerPreferredStyles: React.Dispatch<SetStateAction<string[]>>;
  setCustomerAllergies: React.Dispatch<SetStateAction<string>>;
  setCustomerEmergencyContact: React.Dispatch<SetStateAction<string>>;
};

export const AccountContext = React.createContext<ContextProps>({
  userToken: '',
  editable: false,
  userName: '',
  userBirth: '',
  userPhoneNumber: '',
  userType: 'customer' as UserType,
  profileImage: {},
  // 강사 전용 필드
  instructorIntroduction: '',
  instructorExperience: '',
  instructorSpecialties: [],
  instructorCertifications: [],
  // 고객 전용 필드
  customerSwimmingLevel: '',
  customerPreferredStyles: [],
  customerAllergies: '',
  customerEmergencyContact: '',

  setEditable: () => {},
  setUserName: () => {},
  setUserBirth: () => {},
  setUserPhoneNumber: () => {},
  setUserType: () => {},
  setProfileImage: () => {},
  // 강사 전용 setter
  setInstructorIntroduction: () => {},
  setInstructorExperience: () => {},
  setInstructorSpecialties: () => {},
  setInstructorCertifications: () => {},
  // 고객 전용 setter
  setCustomerSwimmingLevel: () => {},
  setCustomerPreferredStyles: () => {},
  setCustomerAllergies: () => {},
  setCustomerEmergencyContact: () => {},
});
