import { redirect } from "next/navigation";

export default function Schedule() {
  console.log('Schedule')
  redirect('/instructor/schedule/weekly');

}
