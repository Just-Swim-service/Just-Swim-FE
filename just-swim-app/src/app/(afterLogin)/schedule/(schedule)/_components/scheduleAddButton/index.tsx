import Link from "next/link";

import { IconAdd } from "@assets";

import styled from './styles.module.scss';

export function ScheduleAddButton() {
  return (
    <Link href='/schedule/add' className={styled.link}>
      <IconAdd />
    </Link>
  )
}