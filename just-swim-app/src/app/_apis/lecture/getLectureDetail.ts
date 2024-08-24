'use server';

import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { LectureProps } from "@types";
import { Fetch } from "@utils";

export async function getLectureDetail(lectureId: number): Promise<LectureProps | null> {
  const result = await Fetch<{ success: boolean, data: LectureProps }>({
    url: `${process.env.API_URL}/lecture/${lectureId}`,
    header: {
      token: true,
      json: true,
      credential: true,
    }
  });

  if (result.success) {
    return result.data;
  } else {
    return notFound();
  }
}

export async function getCachedLectureDetail(lectureId: number) {
  const cachedResult = unstable_cache(
    getLectureDetail,
    ['lecture-detail'],
    {
      tags: [`lecture-detail`],
      revalidate: 60,
    }
  )

  return cachedResult(lectureId);
}