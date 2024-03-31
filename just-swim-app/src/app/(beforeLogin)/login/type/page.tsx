import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main>
        <div>
          <Link
            href={{
              pathname: '/instructor',
              query: { type: 'instructor' },
            }}>
            <h1>강사 버튼</h1>
          </Link>
        </div>

        <div>
          <Link
            href={{
              pathname: '/customer',
              query: { type: 'customer' },
            }}>
            <h1>회원 버튼</h1>
          </Link>
        </div>
      </main>
    </>
  );
}
