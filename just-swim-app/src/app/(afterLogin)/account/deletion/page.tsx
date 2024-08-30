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
    DELETION_REASON.filter((reason) => reason.name === 'NO_MORE_USE')[0].name,
  );

  const setUserDeletion = async () => {
    await deleteUser({ withdrawalReasonContent: selectedValue! });
    removeTokenInCookies();
    setResetUser();
    router.replace(ROUTES.ONBOARDING.root);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
              {DELETION_REASON.map((reason) => (
                <Radio
                  key={reason.name}
                  name={reason.name}
                  value={reason.text}
                  onChange={handleRadioChange}
                  selected={selectedValue === reason.name}>
                  {reason.text}
                </Radio>
              ))}
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
