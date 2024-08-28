'use client';

import { UserIconHeader } from "@components";

export function ScheduleHeader({
  image
}: {
  image?: string,
}) {
  return (
    <>
      <UserIconHeader title="" image={image} /> 
    </>
  )
}