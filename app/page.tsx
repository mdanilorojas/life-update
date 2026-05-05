import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If user is not logged in, show login CTA
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="max-w-sm w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            Life Update
          </h1>
          <p className="text-lg text-zinc-400">
            Track your transformation. No bullshit.
          </p>
        </div>

        <p className="text-sm text-zinc-500">
          This is a single-user system designed for real accountability and
          honest self-assessment.
        </p>

        <a
          href="/login"
          className="inline-flex w-full items-center justify-center h-10 rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-medium transition-colors"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
