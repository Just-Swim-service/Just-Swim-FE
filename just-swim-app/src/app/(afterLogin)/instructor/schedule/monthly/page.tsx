import Link from 'next/link';

export default function Monthly() {
  return (
    <>
      <h5>Monthly page</h5>
      <Link href="/instructor/schedule/monthly/classList"> Monthly ClassList</Link>
    </>
  );
}
