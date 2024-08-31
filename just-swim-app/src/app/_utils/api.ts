import { notFound } from 'next/navigation';
import { getTokenInCookies } from './handleTokenInCookies';

export async function APICommon<T>({
  url,
  method = 'GET',
  body = null,
}: {
  url: string;
  method?: string;
  body?: Object | null;
}): Promise<T | null> {
  const authorizationToken = getTokenInCookies();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorizationToken}`,
      },
      body: body && JSON.stringify(body),
    });

    const result = await response.json();

    if (result.success) {
      return result.data || null;
    } else {
      return notFound();
    }
  } catch (error) {
    return notFound();
  }
}

export async function Fetch<T>({
  url,
  method = 'GET',
  header = {
    token: false,
    json: false,
    credential: false,
  },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELsETE';
  header?: {
    token?: boolean;
    json?: boolean;
    credential?: boolean;
  };
  body?: Object | null;
}): Promise<T> {
  const authorizationToken = getTokenInCookies();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': header.json ? 'application/json' : '',
        Authorization: header.token ? `Bearer ${authorizationToken}` : '',
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
