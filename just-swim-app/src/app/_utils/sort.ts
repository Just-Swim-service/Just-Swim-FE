import { LectureProps } from "@types";

export function sortSchedule(a: LectureProps, b: LectureProps) {
  const aTime = parseInt(a.lectureTime.split(':')[0]);
  const bTime = parseInt(b.lectureTime.split(':')[0]);

  if (aTime > bTime) {
    return 1;
  } else {
    return -1;
  }
}