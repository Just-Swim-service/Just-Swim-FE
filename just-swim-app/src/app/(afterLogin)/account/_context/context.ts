import React, { SetStateAction } from 'react';

type ContextProps = {
  userToken: string;
  editable: boolean;
  userName: string;
  profileImage: string;
  setEditable: React.Dispatch<SetStateAction<boolean>>;
  setUserName: React.Dispatch<SetStateAction<string>>;
  setProfileImage: React.Dispatch<SetStateAction<string>>;
};

export const AccountContext = React.createContext<ContextProps>({
  userToken: '',
  editable: false,
  userName: '',
  profileImage: '',
  setEditable: () => {},
  setUserName: () => {},
  setProfileImage: () => {},
});
