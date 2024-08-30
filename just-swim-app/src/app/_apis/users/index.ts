'use server';

import { HTTP_METHODS, HTTP_STATUS } from '@data';
import api from '../api';
import {
  DeleteUserReq,
  GetUserProfileRes,
  PatchUserEditReq,
  PostUserLoginReq,
} from '@types';

const USER_NEXT_PUBLIC_API_URL = '/user';
const OAUTH_NEXT_PUBLIC_API_URL = 'api/Oauth';

export const getSignUp = async (param: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${OAUTH_NEXT_PUBLIC_API_URL}/${param}`,
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
  return await api(`${USER_NEXT_PUBLIC_API_URL}/${data}`, HTTP_METHODS.POST);
};

export const getMyProfile = async (): Promise<GetUserProfileRes> => {
  return await api(`${USER_NEXT_PUBLIC_API_URL}/myProfile`, HTTP_METHODS.GET);
};

export const patchUserEdit = async (data: Partial<PatchUserEditReq>) => {
  const formData = new FormData();

  formData.append('editUserDto', JSON.stringify(data));
  return await api(`${USER_NEXT_PUBLIC_API_URL}/edit`, HTTP_METHODS.PATCH, {
    body: formData,
  });
};

export const postUserLogout = async () => {
  return await api(`${USER_NEXT_PUBLIC_API_URL}/logout`, HTTP_METHODS.POST);
};

export const deleteUser = async (data: DeleteUserReq) => {
  return await api(`${USER_NEXT_PUBLIC_API_URL}/withdraw`, HTTP_METHODS.DELETE, {
    body: JSON.stringify(data),
  });
};
