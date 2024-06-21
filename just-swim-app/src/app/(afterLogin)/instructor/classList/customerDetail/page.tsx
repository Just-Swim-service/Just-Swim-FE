'use client';

import { EditHeader } from '@components';
import CustomerInfo from './_components/customerInfo/page';
import FeedbackRecord from './_components/feedbackRecord/page';
import CustomerClass from './_components/customerClass/page';

export default function customerDetail() {
  const data = {
    name: '강사',
    image: '',
  };

  return (
    <>
      <EditHeader leftContent="수업 정보" data={data} />
      <CustomerInfo />
      <CustomerClass />
      <FeedbackRecord />
    </>
  );
}
