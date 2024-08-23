'use server';

import { unstable_cache } from "next/cache";

import { ProfileProps } from "@types";
import { APICommon } from "@utils";

const URL = `${process.env.API_URL}/user`;

async function getMyProfile(): Promise<ProfileProps | null> {
  const result = await APICommon<ProfileProps>({
    url: `${URL}/myProfile`,
  });

  return result;
}

export const getCachedMyProfile = unstable_cache(
  getMyProfile,
  ['my-profile'],
  {
    tags: ['my-profile']
  }
);