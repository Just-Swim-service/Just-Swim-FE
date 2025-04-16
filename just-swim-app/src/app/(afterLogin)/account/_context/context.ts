import React, { SetStateAction } from 'react';

type ContextProps = {
  userToken: string | boolean;
  editable: boolean;
  userName: string;
  profileImage: {
    fileName?: string | undefined;
    fileType?: string | undefined;
    fileURL?: string | undefined;
  };
  setEditable: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
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
  profileImage: {},
  setEditable: () => {},
  setUserName: () => {},
  setProfileImage: () => {},
});
