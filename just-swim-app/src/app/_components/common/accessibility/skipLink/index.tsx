'use client';

import React from 'react';
import styles from './styles.module.scss';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`${styles.skipLink} ${className}`}
      onFocus={(e) => e.target.scrollIntoView({ behavior: 'smooth' })}>
      {children}
    </a>
  );
}
