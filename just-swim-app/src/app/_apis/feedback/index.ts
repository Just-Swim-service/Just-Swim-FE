const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/feedback`;
console.log(URL);

async function getFeedback() {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  const response = await fetch(URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  return json;
}

export { getFeedback };
