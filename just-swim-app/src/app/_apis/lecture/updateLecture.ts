'use server';

import { LectureBasicProps } from "@types";
import { Fetch } from "@utils";

export async function updateLecture(data: LectureBasicProps, id: string): Promise<{ success: boolean, message: string, lectureId: string }> {
  const result = await Fetch<{ success: boolean, message: string, lectureId: string }>({
    url: `${process.env.API_URL}/lecture/${id}`,
    method: 'PATCH',
    header: {
      token: true,
      json: true,
      credential: true,
    },
    body: data
  });

  return result;
}