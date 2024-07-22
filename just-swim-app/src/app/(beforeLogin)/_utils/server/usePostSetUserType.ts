'use client';

import { postSetUserType } from '@/_apis/users.ts';
import { HTTP_STATUS_TYPE, PostSetUserTypeReq, UserType } from '@types';

export const usePostSetUserType = () => {
  const setUserType = async (param: PostSetUserTypeReq) => {
    const response = await postSetUserType(param.userType);
    console.log('response2 : ', response);
    if (response.status === 406) {
      console.log('406 error');
      return response;
    }
    return response;
  };
  return { setUserType };
};
