import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div>
        <Link
          href={{
            pathname: '/login',
            query: { type: 'instructor' },
          }}>
          <h1>강사 버튼</h1>
        </Link>
      </div>
      
      <div>
        <Link
          href={{
            pathname: '/login',
            query: { type: 'customer' },
          }}>
          <h1>회원 버튼</h1>
        </Link>
      </div>
    </>
  );
}
