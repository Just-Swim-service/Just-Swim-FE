'use server';

import { HTTP_METHODS, HTTP_STATUS } from '@data';
import api from '../api';
import { GetUserProfileRes, PatchUserEditReq, PostUserLoginReq } from '@types';

const USER_API_PATH = '/user';
const OAUTH_API_PATH = 'api/Oauth';

export const getSignUp = async (param: string) => {
  const response = await fetch(
    `${process.env.API_PATH}/${OAUTH_API_PATH}/${param}`,
    {
      method: HTTP_METHODS.GET,
    },
  );

  if (response.status === HTTP_STATUS.OK) {
    return response.url as string;
  }
};

// 타입 수정 필요
export const postUserLogin = async (data: PostUserLoginReq) => {
  return await api('/login', HTTP_METHODS.POST, {
    body: JSON.stringify(data),
  });
};

export const postUserType = async (data: string) => {
  return await api(`${USER_API_PATH}/${data}`, HTTP_METHODS.POST);
};

export const getMyProfile = async (): Promise<GetUserProfileRes> => {
  return await api(`${USER_API_PATH}/myProfile`, HTTP_METHODS.GET);
};

export const patchUserEdit = async (data: Partial<PatchUserEditReq>) => {
  const formData = new FormData();

  formData.append('editUserDto', JSON.stringify(data));
  return await api(`${USER_API_PATH}/edit`, HTTP_METHODS.PATCH, {
    body: formData,
  });
};
