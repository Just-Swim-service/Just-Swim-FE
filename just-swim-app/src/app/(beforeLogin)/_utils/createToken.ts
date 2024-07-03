'use server';

import { cookies } from 'next/headers';

type Props = {
  token: string;
};

export const createToken = async ({ token }: Props) => {
  cookies().set('token', token);
};
