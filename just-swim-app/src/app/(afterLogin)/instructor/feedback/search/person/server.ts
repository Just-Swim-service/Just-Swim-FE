'use server';

import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// _types 폴더 내부로 이동
export interface MemberProps {
  userId: string;
  memberId: string;
  lectureId: string;
  lectureTitle: string;
  memberNickname: string;
  profileImage: string;
}

// 이 부분은 무시해도 좋음
// 그냥 내가 만들어서 쓰는 Fetch 함수
async function Fetch<T>({
  url,
  method = 'GET',
  header = {
    token: false,
    json: false,
    credential: false,
  },
  body = null,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELsETE';
  header?: {
    token?: boolean;
    json?: boolean;
    credential?: boolean;
  };
  body?: Object | null;
}): Promise<T> {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': header.json ? 'application/json' : '',
        Authorization: header.token
          ? `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
          : '',
        credentials: header.credential ? 'include' : '',
      },
      body: body && JSON.stringify(body),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return notFound();
  }
}

// _apis 폴더 내부로 이동
async function getMember(): Promise<MemberProps[] | null> {
  const result = await Fetch<{ success: boolean; data: MemberProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/member`,
    header: {
      token: true,
      json: true,
      credential: true,
    },
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

export const getCachedMember = unstable_cache(getMember, ['member-list'], {
  tags: ['member'],
  revalidate: 60,
});

// _utils 폴더 내부로 이동
// 이름 순으로 정렬, 이름이 같을 경우 강의명 순으로 정렬
function sortMember(a: MemberProps, b: MemberProps) {
  if (a.memberNickname < b.memberNickname) {
    return -1;
  } else if (a.memberNickname > b.memberNickname) {
    return 1;
  } else {
    if (a.lectureTitle < b.lectureTitle) {
      return -1;
    } else {
      return 1;
    }
  }
}

// _utils 폴더 내부로 이동
interface DataProps {
  [key: string]: MemberProps[];
}

// 강의 별로 수강생 묶어주기
// 현재는 강의명 기준으로 묶었는데 강의명보다는 강의 id로 처리하는 것이 훨씬 안정적으로 보임
// 현재 백엔드에서 중복 강의명에 대한 처리가 되어있지 않아서 문제가 발생할 여지가 있음
async function getMemberGroupByLecture(): Promise<
  { lecture: string; members: MemberProps[] }[]
> {
  const memberList = (await getCachedMember()) || [];
  const data: DataProps = {};

  for (const member of memberList) {
    const lectureTitle = member.lectureTitle;

    if (!data[lectureTitle]) {
      data[lectureTitle] = [];
    }

    data[lectureTitle].push(member);
  }

  const keys = Object.keys(data).sort();
  const result = [];

  for (const key of keys) {
    result.push({
      lecture: key,
      members: data[key].sort(sortMember),
    });
  }

  return result;
}

export const getCachedMemberGroupByLecture = unstable_cache(
  getMemberGroupByLecture,
  ['member-list-group'],
  {
    tags: ['member'],
    revalidate: 60,
  },
);

// _utils 폴더 내부로 이동
// 이름순으로 수강생 정렬
async function getSortedMember() {
  const memberList = (await getCachedMember()) || [];

  memberList.sort(sortMember);

  return memberList;
}

export const getCachedSortedMember = unstable_cache(
  getSortedMember,
  ['member-list-name'],
  {
    tags: ['member'],
    revalidate: 60,
  },
);
