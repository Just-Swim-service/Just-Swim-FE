'use server';

import { cookies } from 'next/headers';

export const setTokenInCookies = (token: string) => {
  cookies().set('token', token);

  return token;
};

export const getTokenInCookies = () => {
  const token = cookies().get('token')?.value;

  return token || '';
};

export const removeTokenInCookies = () => {
  cookies().set('token', '', {
    expires: new Date(0),
  });
  
  return;
};
