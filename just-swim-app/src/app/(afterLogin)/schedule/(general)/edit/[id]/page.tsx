import { getCachedLectureDetail } from "@apis";

import { FormBody } from "../../_components";

export default async function ScheduleEditPage({
  params
}: {
  params: { id: string }
}) {
  const lectureDetail = await getCachedLectureDetail(parseInt(params.id));
  
  return (
    <>
      {
        lectureDetail &&
        <FormBody type="modify" id={params.id} lecture={lectureDetail} />
      }
    </>
  )
}