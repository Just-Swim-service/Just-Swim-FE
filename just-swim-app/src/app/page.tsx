import { redirect } from 'next/navigation';
import { ROUTES } from '@data';
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('authorization')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken && refreshToken) {
    redirect(ROUTES.SCHEDULE.root);
  } else {
    redirect(ROUTES.ONBOARDING.signin);
  }
}
