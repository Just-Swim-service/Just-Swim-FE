import { getMemberGroupByLecture, getSortedMember } from './server';
import { Search } from './search';

export async function SearchWrapper() {
  // 데이터 받아와서 전달
  const memberGroupByLecture = await getMemberGroupByLecture();
  const sortedMember = await getSortedMember();
  return (
    <>
      <Search group={memberGroupByLecture} name={sortedMember} />
    </>
  );
}
