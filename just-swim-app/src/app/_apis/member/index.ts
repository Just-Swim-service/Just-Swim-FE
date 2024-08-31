import { getTokenInCookies } from '@utils';

const URL = `${process.env.NEXT_PUBLIC_API_URL}`;
// console.log(URL);

async function getMemberList() {
  const authorizationToken = getTokenInCookies();

  const response = await fetch(`${URL}/member`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationToken}`,
    },
  });
  const json = await response.json();
  return json.data;
}

async function getClassList() {
  const authorizationToken = getTokenInCookies();

  const response = await fetch(`${URL}/lecture/myLectures`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorizationToken}`,
    },
  });
  const json = await response.json();

  return json.data;
}

export { getMemberList, getClassList };
