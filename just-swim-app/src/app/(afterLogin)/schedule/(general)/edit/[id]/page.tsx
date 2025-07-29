import { getLectureDetail } from '@apis';
import { notFound } from 'next/navigation';

import { FormBody } from '../../_components';

export default async function ScheduleEditPage({
  params,
}: {
  params: { id: string };
}) {
  const lectureDetail = await getLectureDetail(parseInt(params.id));

  if (!lectureDetail) {
    notFound();
  }

  return (
    <>
      <FormBody type="modify" id={params.id} lecture={lectureDetail} />
    </>
  );
}
