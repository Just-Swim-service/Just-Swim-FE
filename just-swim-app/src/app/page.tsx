import { redirect } from 'next/navigation';
import { ROUTES } from '@data';

export default function Page() {
  redirect(ROUTES.ONBOARDING.signin);
}
