'use client';

import { FeedbackTargetListModalProps } from '@types';
import styled from './feedbackTargetListModal.module.scss';
import { ModalBody } from '@components';
import Image from 'next/image';

export function FeedbackTargetListModal({
  feedbackTargetList,
  hideModal,
}: FeedbackTargetListModalProps) {
  return (
    <ModalBody hideModal={hideModal}>
      <div className={styled.modal}>
        <div className={styled.member_list_title}>
          <p>피드백 대상</p>
        </div>
        <div className={styled.member_list_wrapper}>
          {feedbackTargetList.map((target, index) => (
            <div key={index} className={styled.member_list_item}>
              <div className={styled.image_wrapper}>
                {target.memberProfileImage &&
                target.memberProfileImage.startsWith('http') ? (
                  <Image
                    src={target.memberProfileImage}
                    alt={target.memberName}
                    width={34}
                    height={34}
                    priority
                  />
                ) : (
                  <div className={styled.empty_image} />
                )}
              </div>
              <div className={styled.box}>
                <p className={styled.name}>{target.memberName} 님</p>
                <div className={styled.lecture}>
                  <p>{target.lectureTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalBody>
  );
}
