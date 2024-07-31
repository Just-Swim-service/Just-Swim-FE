import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/signin');
  return null;
}
