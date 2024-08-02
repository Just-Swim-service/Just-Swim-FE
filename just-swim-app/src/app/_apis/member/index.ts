const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/member`;
console.log(URL);

async function getMemberList() {
  const response = await fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  return json;
}

export { getMemberList };
