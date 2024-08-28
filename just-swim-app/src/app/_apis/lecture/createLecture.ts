'use server';

import { LectureBasicProps } from "@types";
import { Fetch } from "@utils";

export async function createLecture(data: LectureBasicProps): Promise<{ success: boolean, message: string, data: { lectureId: string } }> {
  const result = await Fetch<{ success: boolean, message: string, data: { lectureId: string } }>({
    url: `${process.env.API_URL}/lecture`,
    method: 'POST',
    header: {
      token: true,
      json: true,
      credential: true,
    },
    body: data
  });

  return result;
}