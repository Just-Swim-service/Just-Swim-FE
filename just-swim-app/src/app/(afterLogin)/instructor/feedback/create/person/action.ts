'use server';

import { formSchema } from '@/_schema/index';
import { redirect } from 'next/navigation';

export async function submitForm(formData: FormData) {
  await new Promise((r) => setTimeout(r, 2000));

  const data = {
    target: formData.get('target'),
    date: formData.get('date'),
    file: formData.get('file'),
    link: formData.get('link'),
    content: formData.get('content'),
  };

  const result = formSchema.safeParse(data);
  
  if (!result.success) {
    return result.error.flatten();
  } else {
    redirect('confirm');
  }
  // 관련 작업 수행

  // 이후 redirect와 같은 로직 수행
}
