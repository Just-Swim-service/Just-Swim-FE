'use client';

import React from 'react';
import styles from './styles.module.scss';

interface DropdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }>;
}

export function DropdownModal({ isOpen, onClose, items }: DropdownModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div className={styles.dropdown_overlay} onClick={onClose} />

      {/* 드롭다운 메뉴 */}
      <div className={styles.dropdown_menu}>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`${styles.dropdown_item} ${item.danger ? styles.danger : ''}`}>
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
