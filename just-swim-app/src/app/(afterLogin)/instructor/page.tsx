import { redirect } from 'next/navigation';

export default function Instructor() {
  console.log('Instructor')
  redirect('/instructor/schedule');
  // return (
  //   <div>
  //     <h1>강사 홈</h1>
  //     <Link href={'/instructor/classList/classListTabs'}>classList</Link>
  //     <br />
  //     <Link href={'/instructor/classList/customerDetail'}>customerDetail</Link>
  //   </div>
  // );
}
