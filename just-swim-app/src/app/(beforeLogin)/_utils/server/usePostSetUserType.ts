'use client';

import { postSetUserType } from '@/_apis/users.ts';
import { PostSetUserTypeReq } from '@types';

export const usePostSetUserType = () => {
  const setUserType = async (param: PostSetUserTypeReq) => {
    return await postSetUserType(param.userType);
  };
  return { setUserType };
};
