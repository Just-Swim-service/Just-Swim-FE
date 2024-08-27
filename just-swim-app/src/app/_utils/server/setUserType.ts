'use client';

import { postUserType } from '@apis';
import { PostUserTypeReq } from '@types';

export const setUserType = async (param: PostUserTypeReq) => {
  return await postUserType(param.userType);
};
