import { getCachedMemberGroupByLecture, getCachedSortedMember } from "./server";
import { Search } from "./search";

export async function SearchWrapper() {
  // 데이터 받아와서 전달
  const memberGroupByLecture = await getCachedMemberGroupByLecture();
  const sortedMember = await getCachedSortedMember();

  return (
    <>
      <Search group={memberGroupByLecture} name={sortedMember} />
    </>
  )
}