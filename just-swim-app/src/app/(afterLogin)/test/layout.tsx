'use client';

import React, { useState } from "react";

import { ProfileEditCompleteToast } from "@components";

export const PageContext = React.createContext<{
  showToast: () => void
}>({
  showToast: () => {}
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState<boolean>(false);

  const showToast = () => {
    setShow(true);
  }

  const unshowToast = () => {
    setShow(false);
  }

  return (
    <PageContext.Provider value={{ showToast }}>
      {children}
      {
        show &&
        <ProfileEditCompleteToast unshowToast={unshowToast} />
      }
    </PageContext.Provider>
  )
}