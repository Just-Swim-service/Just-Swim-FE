const URL = `${process.env.NEXT_PUBLIC_DB_HOST}/feedback`;

async function getFeedback() {
  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  });
  const json = await response.json();
  return json.data;
}

async function postFeedback(data, type, target) {
  let value = {
    feedbackType: type,
    feedbackDate: data.date,
    feedbackLink: data.link,
    feedbackContent: data.content,
    feedbackTarget: target,
  };

  // console.log('val', value);
  let formData = new FormData();
  formData.append('feedbackDto', JSON.stringify(value));

  if (data.file) {
    Array.from(data.file).forEach((el, i) => {
      // console.log(el);
      formData.append('files', el);
    });
  }

  formData.forEach((value, key) => {
    console.log(value, key);
  });

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
    body: formData,
  });

  const json = await response.json();
  return json;
}

export { getFeedback, postFeedback };
