'use client';

import CustomerInfo from './_components/customerInfo/page';
import FeedbackRecord from './_components/feedbackRecord/page';
import CustomerClass from './_components/customerClass/page';

export default function customerDetail() {
  return (
    <>
      <CustomerInfo />
      <CustomerClass />
      <FeedbackRecord />
    </>
  );
}
