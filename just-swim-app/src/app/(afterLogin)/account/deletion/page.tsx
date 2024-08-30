'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './pages.module.scss';

import { ConfirmButton, DeleteModal } from '@components';
import { DELETION_REASON, ROUTES, TEXT } from '@data';
import { useUserStore } from '@store';
import { removeTokenInCookies } from '@utils';
import { deleteUser } from '@apis';

function Radio({
  children,
  value,
  name,
  disabled,
  selected,
  defaultChecked,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  name: string;
  disabled?: boolean;
  selected: boolean;
  defaultChecked?: boolean;
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
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      {children}
    </label>
  );
}

function RadioGroup({ children }: { children: React.ReactNode }) {
  return <fieldset className={styles.radio_group}>{children}</fieldset>;
}

export default function Deletion() {
  const router = useRouter();
  const { setResetUser } = useUserStore();
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    DELETION_REASON.NO_MORE_USE.name,
  );

  const setUserDeletion = async () => {
    await deleteUser({ withdrawalReasonContent: selectedValue! });
    removeTokenInCookies();
    setResetUser();
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
    setSelectedValue(event.target.name);
  };

  const handleDeletion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowDeletionModal(true);
  };

  return (
    <>
      <div className={styles.deletion}>
        <div className={styles.deletion_header}>
          <div className={styles.title}>
            <h3>{TEXT.ACCOUNT_PAGE.deletionTitle}</h3>
          </div>
          <div className={styles.content}>
            <p>{TEXT.ACCOUNT_PAGE.deletionContent}</p>
          </div>
        </div>
        <div className={styles.deletion_section}>
          <form
            onSubmit={(event) => {
              handleDeletion(event);
            }}>
            <RadioGroup>
              <Radio
                name={DELETION_REASON.NO_MORE_USE.name}
                value={DELETION_REASON.NO_MORE_USE.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.NO_MORE_USE.name}>
                {DELETION_REASON.NO_MORE_USE.text}
              </Radio>
              <Radio
                name={DELETION_REASON.NOT_USEFUL.name}
                value={DELETION_REASON.NOT_USEFUL.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.NOT_USEFUL.name}>
                {DELETION_REASON.NOT_USEFUL.text}
              </Radio>
              <Radio
                name={DELETION_REASON.ERROR.name}
                value={DELETION_REASON.ERROR.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.ERROR.name}>
                {DELETION_REASON.ERROR.text}
              </Radio>
              <Radio
                name={DELETION_REASON.PRIVACE.name}
                value={DELETION_REASON.PRIVACE.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.PRIVACE.name}>
                {DELETION_REASON.PRIVACE.text}
              </Radio>
              <Radio
                name={DELETION_REASON.ERROR.name}
                value={DELETION_REASON.ERROR.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.ERROR.name}>
                {DELETION_REASON.ERROR.text}
              </Radio>
              <Radio
                name={DELETION_REASON.ETC.name}
                value={DELETION_REASON.ETC.text}
                onChange={handleRadioChange}
                selected={selectedValue === DELETION_REASON.ETC.name}>
                {DELETION_REASON.ETC.text}
              </Radio>
            </RadioGroup>
            <div className={styles.deletion_confirm}>
              <ConfirmButton
                kind="confirm"
                text={TEXT.COMMON.confirm}
                type="submit"
              />
            </div>
          </form>
        </div>
        {showDeletionModal && (
          <DeleteModal
            setShowModal={setShowDeletionModal}
            setUserDeletion={setUserDeletion}
          />
        )}
      </div>
    </>
  );
}
