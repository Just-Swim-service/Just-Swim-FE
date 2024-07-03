'use server';

import api from '../api';

const OAUTH_PATH = '/Oauth';

export const getSignUp = async (param: string) => {
  return await api(`${OAUTH_PATH}/${param}`, {});
};
