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
  position?: {
    top?: string;
    right?: string;
    left?: string;
    bottom?: string;
  };
}

export function DropdownModal({
  isOpen,
  onClose,
  items,
  position = { top: '100%', right: '0' },
}: DropdownModalProps) {
  console.log(
    '🔥 DropdownModal render - isOpen:',
    isOpen,
    'items:',
    items.length,
  );

  if (!isOpen) {
    console.log('❌ DropdownModal: Not rendering because isOpen is false');
    return null;
  }

  console.log(
    '✅ DropdownModal: Rendering dropdown with',
    items.length,
    'items',
  );
  return (
    <>
      {/* 오버레이 */}
      <div className={styles.dropdown_overlay} onClick={onClose} />

      {/* 드롭다운 메뉴 */}
      <div
        className={styles.dropdown_menu}
        style={{
          top: position.top,
          right: position.right,
          left: position.left,
          bottom: position.bottom,
        }}>
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
