'use server';

import { HTTP_METHODS, HTTP_STATUS } from '@data';
import api from '../api';
import {
  DeleteUserReq,
  GetUserProfileRes,
  PatchUserEditReq,
  PostUserLoginReq,
} from '@types';
import { revalidateTag } from 'next/cache';
import { Fetch } from '@utils';
import { cookies } from 'next/headers';

const USER_API_PATH = '/user';
const OAUTH_API_PATH = 'Oauth';

export const getSignUp = async (param: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${OAUTH_API_PATH}/${param}`,
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
  const authorizationToken = cookies().get('token')?.value;

  const value = JSON.stringify(data);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${USER_API_PATH}/edit`,
    {
      method: HTTP_METHODS.PATCH,
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
        'Content-Type': 'application/json',
      },
      body: value,
      credentials: 'include',
    },
  );
  const json = await res.json();

  return {
    status: res.status,
    data: json,
  };
};

export async function revalidateMyProfile() {
  revalidateTag('my-profile');
}

export const postUserLogout = async () => {
  return await api(`${USER_API_PATH}/logout`, HTTP_METHODS.POST);
};

export const deleteUser = async (data: DeleteUserReq) => {
  return await api(`${USER_API_PATH}/withdraw`, HTTP_METHODS.DELETE, {
    body: JSON.stringify(data),
  });
};
