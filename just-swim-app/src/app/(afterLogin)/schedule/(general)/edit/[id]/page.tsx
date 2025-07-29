import { getLectureDetail } from '@apis';

import { FormBody } from '../../_components';

export default async function ScheduleEditPage({
  params,
}: {
  params: { id: string };
}) {
  const lectureDetail = await getLectureDetail(parseInt(params.id));

  return (
    <>
      {lectureDetail && (
        <FormBody type="modify" id={params.id} lecture={lectureDetail} />
      )}
    </>
  );
}
