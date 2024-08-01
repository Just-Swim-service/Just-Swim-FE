'use client';

import { postSetUserType } from '@/_apis/users.ts';
import { PostSetUserTypeReq } from '@types';

// TODO: 이 파일의 필요성 생각하기
export const usePostSetUserType = () => {
  const setUserType = async (param: PostSetUserTypeReq) => {
    return await postSetUserType(param.userType);
  };
  return { setUserType };
};
