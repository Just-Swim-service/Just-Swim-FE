'use client';

import { useState } from "react";

import { TipModal } from "@components";

import { FormBody } from "../_components";

export default function AddSchedule() {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <FormBody />
      {
        showModal &&
        <TipModal setShowModal={setShowModal} />
      }
    </>
  )
}