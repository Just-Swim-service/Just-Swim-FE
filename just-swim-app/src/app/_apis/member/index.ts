const URL = `${process.env.NEXT_PUBLIC_DB_HOST}`;
// console.log(URL);

async function getMemberList() {
  const response = await fetch(`${URL}/member`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  return json.data;
}

async function getClassList() {
  const response = await fetch(`${URL}/lecture/myLectures`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  console.log(json.data);

  return json.data;
}

export { getMemberList, getClassList };
