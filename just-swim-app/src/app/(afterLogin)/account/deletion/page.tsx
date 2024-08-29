'use client';

import React, { useState } from 'react';
import styles from './pages.module.scss';

import { IconGallery, IconInputValid } from '@assets';
import {
  ConfirmButton,
  FormButton,
  Input,
  LogoutModal,
  URLImage,
} from '@components';
import { ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { removeTokenInCookies } from '@utils';
import { useRouter } from 'next/navigation';
import { deleteUser } from '@apis';

function Radio({
  children,
  value,
  name,
  disabled,
  selected,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  name: string;
  disabled?: boolean;
  selected: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label>
      <input
        type="radio"
        value={value}
        name={name}
        disabled={disabled}
        checked={selected}
        onChange={onChange}
      />
      {children}
    </label>
  );
}

function RadioGroup({ children }: { children: React.ReactNode }) {
  return <fieldset>{children}</fieldset>;
}

export default function Deletion() {
  const router = useRouter();
  const { setResetUser } = useUserStore();
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isETCActive, setIsETCActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const setUserDeletion = async () => {
    await deleteUser();
    removeTokenInCookies();
    setResetUser();
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
    setIsActive(true);
    setSelectedValue(event.target.name);

    if (event.target.name === 'ETC') {
      setIsETCActive(true);
    } else {
      setIsETCActive(false);
    }
  };

  const handleDeletion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowDeletionModal(true);
    console.log('event: ', event);
  };

  return (
    <>
      <div className={styles.account_section}></div>
      <div className={styles.select_type_header}>
        <div>
          <h3>탈퇴하는 이유가 무엇인가요?</h3>
        </div>
        <div>
          <p>더 나은 서비스가 될 수 있도록 의견을 들려주세요.</p>
        </div>
      </div>
      <form
        onSubmit={(event) => {
          handleDeletion(event);
        }}>
        <RadioGroup>
          <Radio
            name="NO_MORE_USE"
            value="더 이상 사용하지 않는 앱이에요."
            onChange={handleRadioChange}
            selected={selectedValue === 'NO_MORE_USE'}>
            더 이상 사용하지 않는 앱이에요.
          </Radio>
          <Radio
            name="NOT_USEFUL"
            value="기능이 유용하지 않아요."
            onChange={handleRadioChange}
            selected={selectedValue === 'NOT_USEFUL'}>
            기능이 유용하지 않아요.
          </Radio>
          <Radio
            name="PRIVACE"
            value="개인 정보 공개가 불안해요."
            onChange={handleRadioChange}
            selected={selectedValue === 'PRIVACE'}>
            개인 정보 공개가 불안해요.
          </Radio>
          <Radio
            name="OTHER_SERVICE"
            value="다른 유사 서비스를 이용 중이에요."
            onChange={handleRadioChange}
            selected={selectedValue === 'OTHER_SERVICE'}>
            다른 유사 서비스를 이용 중이에요.
          </Radio>
          <Radio
            name="ETC"
            value="기타"
            onChange={handleRadioChange}
            selected={selectedValue === 'ETC'}>
            기타
            {isETCActive && <input></input>}
          </Radio>
        </RadioGroup>
        <div className={styles.deletion_confirm}>
          <ConfirmButton
            kind="confirm"
            text="확인"
            type="submit"
            active={isActive}
          />
        </div>
      </form>
      {showDeletionModal && (
        <LogoutModal
          showModal={showDeletionModal}
          setShowModal={setShowDeletionModal}
          setUserLogout={setUserDeletion}
        />
      )}
    </>
  );
}
