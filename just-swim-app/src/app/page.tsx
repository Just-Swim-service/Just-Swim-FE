import { cookies } from 'next/headers';
import { SigninCheck } from '@components';
import { MainContent } from './_components/common/signinCheck/mainContent';

export default function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('authorization')?.value;

  return (
    <>
      <SigninCheck />
      <MainContent />
    </>
  );
}
