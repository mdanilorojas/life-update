import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to daily
  if (session) {
    redirect("/daily");
  }

  // If user is not logged in, redirect to login
  redirect("/login");
}
