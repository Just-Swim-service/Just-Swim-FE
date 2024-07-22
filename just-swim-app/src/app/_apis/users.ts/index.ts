'use server';

import api from '../api';

const OAUTH_API_PATH = '/Oauth';
const USER_API_PATH = '/user';

// string 타입 수정해야함.
export const getSignUp = async (param: string) => {
  return await api(`${OAUTH_API_PATH}/${param}`, {});
};

export const getMyProfile = async () => {
  return await api(`${USER_API_PATH}/myProfile`, {});
};
