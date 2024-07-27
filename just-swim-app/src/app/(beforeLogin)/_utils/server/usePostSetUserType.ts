'use client';

import { postSetUserType } from '@/_apis/users.ts';
import { HTTP_STATUS_TYPE, PostSetUserTypeReq, UserType } from '@types';

export const usePostSetUserType = () => {
  // 토큰 체크?
  const setUserType = async (param: PostSetUserTypeReq) => {
    return await postSetUserType(param.userType);
    // const { status, data } = await postSetUserType(param.userType);
    // console.log('response : ', status);
    // console.log('data : ', data);

    // if (status === 406) {
    //   // if (response.status === 406) {
    //   return data;
    // }
    // return data;
  };
  return { setUserType };
};
