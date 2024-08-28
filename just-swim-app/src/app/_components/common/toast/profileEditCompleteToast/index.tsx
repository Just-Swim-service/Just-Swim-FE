'use client';

import { useEffect, useState } from 'react';

import { Portal } from '@components';
import { IconCheckboxSelected } from '@assets';

import styled from './styles.module.scss';
import { TEXT } from '@data';

export function ProfileEditCompleteToast({
  until = 3000,
  unshowToast = () => {},
}: {
  until?: number;
  unshowToast?: () => void;
}) {
  const [unmount, setUnmount] = useState<boolean>(false);
  const [disappear, setDisappear] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setDisappear(true);
    }, until);
  }, [until]);

  useEffect(() => {
    if (!disappear) {
      return;
    }

    setTimeout(() => {
      setUnmount(true);
      unshowToast();
    }, 600);
  }, [disappear, unshowToast]);

  return (
    <Portal type="toast">
      {!unmount ? (
        <div className={`${styled.container} ${disappear && styled.unshow}`}>
          <IconCheckboxSelected />
          <p>{TEXT.COMMON_COMPONENT.profileToast}</p>
        </div>
      ) : (
        <></>
      )}
    </Portal>
  );
}
