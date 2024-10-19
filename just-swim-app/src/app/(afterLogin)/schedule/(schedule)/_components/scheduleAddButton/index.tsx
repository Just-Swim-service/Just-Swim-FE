'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

import { IconAdd } from "@assets";
import { useUserStore } from "@store";

import styled from './styles.module.scss';

export function ScheduleAddButton({
  token
}: {
  token: string,
}) {
  const { getUserType } = useUserStore();

  const type = getUserType(token);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {
        mounted && type === 'instructor' &&
        <Link href='/schedule/add' className={styled.link}>
          <IconAdd />
        </Link>
      }
    </>
  );
}