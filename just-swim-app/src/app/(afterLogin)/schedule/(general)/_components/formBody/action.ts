'use server';

import { revalidateTag } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { createLecture, updateLecture } from "@apis";

export async function formAction(formData: FormData) {
  const type = formData.get("apiType");

  const object = {
    lectureTitle: formData.get("lectureTitle")!.toString(),
    lectureContent: formData.get("lectureContent")!.toString(),
    lectureTime: formData.get("lectureTime")!.toString(),
    lectureDays: formData.get("lectureDays")!.toString(),
    lectureLocation: formData.get("lectureLocation")!.toString(),
    lectureColor: formData.get("lectureColor")!.toString(),
    lectureQRCode: "QR코드",
    lectureEndDate: formData.get("lectureEndDate")!.toString(),
  }
  if (type === 'modify') {
    const result = await updateLecture(object, formData.get("lectureId")!.toString());

    if (result.success) {
      revalidateTag('schedule');
      revalidateTag(`lecture-detail`);
      redirect(`/schedule`);
    } else {
      return result;
    }
  } else {
    const result = await createLecture(object);

    if (result.success) {
      revalidateTag('schedule');
      redirect(`/schedule/add/complete/${result.data.lectureId}`);
    } else {
      return result;
    }
  }
}