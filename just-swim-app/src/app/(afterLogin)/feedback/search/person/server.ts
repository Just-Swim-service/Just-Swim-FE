'use server';

// _types 폴더 내부로 이동
export interface MemberProps {
  userId: string;
  memberId: string;
  lectureId: string;
  lectureTitle: string;
  memberNickname: string;
  profileImage: string;
}

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
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  header?: {
    token?: boolean;
    json?: boolean;
    credential?: boolean;
  };
  body?: Object | null;
}): Promise<T | null> {
  try {
    const headers: HeadersInit = {};

    if (header.json) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      credentials: header.credential ? 'include' : 'same-origin',
      body: body ? JSON.stringify(body) : null,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch 함수 에러:', error);
    return null;
  }
}

// _apis 폴더 내부로 이동
export async function getMember(): Promise<MemberProps[] | null> {
  const result = await Fetch<{ success: boolean; data: MemberProps[] }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/member`,
    header: {
      token: true,
      json: true,
      credential: true,
    },
  });

  if (result && result.success) {
    return result.data;
  } else {
    console.error('멤버 목록 조회 실패');
    return null;
  }
}

// _utils 폴더 내부로 이동
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

interface DataProps {
  [key: string]: MemberProps[];
}

export async function getMemberGroupByLecture(): Promise<
  { lecture: string; members: MemberProps[] }[]
> {
  const memberList = (await getMember()) || [];
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

export async function getSortedMember(): Promise<MemberProps[]> {
  const memberList = (await getMember()) || [];
  return memberList.sort(sortMember);
}
