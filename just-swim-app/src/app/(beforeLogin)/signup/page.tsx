import { ROUTES } from '@/_data/routes';
import { redirect } from 'next/navigation';

export default function Page() {
  redirect(ROUTES.ONBOARDING.type);
}
