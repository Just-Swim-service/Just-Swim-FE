import { redirect } from 'next/navigation';
import { ROUTES } from '@data';
import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (refreshToken) {
    redirect(ROUTES.SCHEDULE.root);
  } else {
    // 없으면 로그인 페이지로
    redirect(ROUTES.ONBOARDING.signin);
  }
}
