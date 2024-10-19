import { notFound, redirect } from 'next/navigation';

import { getTokenInCookies } from '@utils';

export async function Fetch<T>({
  url,
  method = 'GET',
  header = {
    token: false,
    json: false,
    credential: false,
    formData: false,
  },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  header?: {
    token?: boolean;
    json?: boolean;
    credential?: boolean;
    formData?: boolean;
  };
  body?: Object | null;
}): Promise<T> {
  const token = await getTokenInCookies();

  if (!token) {
    redirect('/signin');
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': header.json ? 'application/json' : header.formData ? 'multipart/form-data' : '',
        Authorization: header.token
          ? `Bearer ${token}`
          : '',
        credentials: header.credential ? 'include' : '',
      },
      body: body && JSON.stringify(body),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return notFound();
  }
}
