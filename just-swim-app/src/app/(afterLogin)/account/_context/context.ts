import React, { SetStateAction } from 'react';

type ContextProps = {
  userToken: string | boolean;
  editable: boolean;
  userName: string;
  userBirth: string;
  userPhoneNumber: string;
  profileImage: {
    fileName?: string | undefined;
    fileType?: string | undefined;
    fileURL?: string | undefined;
  };
  setEditable: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
  setUserBirth: React.Dispatch<SetStateAction<string>>;
  setUserPhoneNumber: React.Dispatch<SetStateAction<string>>;
  setProfileImage: React.Dispatch<
    SetStateAction<{
      fileName?: string | undefined;
      fileType?: string | undefined;
      fileURL?: string | undefined;
    }>
  >;
};

export const AccountContext = React.createContext<ContextProps>({
  userToken: '',
  editable: false,
  userName: '',
  userBirth: '',
  userPhoneNumber: '',
  profileImage: {},
  setEditable: () => {},
  setUserName: () => {},
  setUserBirth: () => {},
  setUserPhoneNumber: () => {},
  setProfileImage: () => {},
});
