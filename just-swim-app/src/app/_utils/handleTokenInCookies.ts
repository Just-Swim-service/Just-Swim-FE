'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const setTokenInCookies = (token: string) => {
  cookies().set('token', token);
  return token;
};

export const getTokenInCookies = () => {
  const token = cookies().get('token')?.value;

  if (!token) {
    return redirect('/');
  }
  return token || '';
};

export const removeTokenInCookies = () => {
  cookies().set('token', '', {
    expires: new Date(0),
  });
  return;
};
