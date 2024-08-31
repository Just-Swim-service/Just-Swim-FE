'use server';

import { HTTP_METHODS_TYPE } from '@types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/*  
추후 프로덕션인지 dev 인지에 따라 다른 ENV 사용하도록 수정 - 배포 전에 해결해야함 
// process.env.NODE_ENV === 'production'
//   ? process.env.NEXT_PUBLIC_PROD_API_URL
//   : process.env.NEXT_PUBLIC_DEV_API_URL;
*/
type Response<T> = {
  status: number;
  data: T;
};

const api = async <T>(
  url: string,
  method: HTTP_METHODS_TYPE,
  options?: RequestInit,
): Promise<Response<T>> => {
  const base = `${process.env.NEXT_PUBLIC_API_URL}`;
  // TODO: 바꾸기
  const authorizationToken = cookies().get('token')?.value;
  const URL = `${base}${url}`;
  const defaultOptions: RequestInit = {
    method: method,
    headers: {
      Authorization: authorizationToken ? `Bearer ${authorizationToken}` : '',
      ...options?.headers,
    },
    credentials: 'include',
  };
  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(URL, finalOptions);
    const data = await response.json();

    return { status: response.status, data };
  } catch (error) {
    // redirect('/not-found');
    throw new Error('Redirect to not-found pages');
  }
};

export default api;
