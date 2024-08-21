import { redirect } from "next/navigation";

export default function Weekly() {
  console.log('Weekly')
  redirect("/instructor/schedule/weekly/classList");
}
