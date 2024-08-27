import { getCachedLectureDetail, getCachedMyProfile } from '@apis';

import { QRCode, QRCodeHeader, ButtonWrapper } from './_components';

import styled from './styles.module.scss';

export default async function Complete({
  params
}: {
  params: { id: string }
}) {
  const lectureDetail = await getCachedLectureDetail(parseInt(params.id));
  const profileInfo = await getCachedMyProfile();

  return (
    <>
      {
        lectureDetail &&
        <div className={styled.container}>
        <QRCodeHeader />
        <div className={styled.complete_message}>
          <p>수업 등록이 완료되었습니다.</p>
          <p>생성된 QR을 수강생에게 전달해주세요!</p>
        </div>
        <QRCode
          lectureData={lectureDetail}
          instructorData={profileInfo!}
        />
        <ButtonWrapper
          id={params.id}
        />
      </div>
      }
    </>
  )
}