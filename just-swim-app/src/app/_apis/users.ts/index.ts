'use server';

import { HTTP_METHODS as HTTP_METHODS } from '@data';
import api from '../api';
import { GetUserProfileRes } from '@types';

const USER_API_PATH = '/user';

export const postSetUserType = async (data: string) => {
  return await api(`${USER_API_PATH}/${data}`, HTTP_METHODS.POST);
};

export const getMyProfile = async (): Promise<GetUserProfileRes> => {
  return await api(`${USER_API_PATH}/myProfile`, HTTP_METHODS.GET);
};
