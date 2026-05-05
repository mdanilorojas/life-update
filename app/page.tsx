import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";

export default async function Home() {
  const authenticated = await isAuthenticated();

  // If user is logged in, redirect to daily
  if (authenticated) {
    redirect("/daily");
  }

  // If user is not logged in, redirect to login
  redirect("/login");
}
