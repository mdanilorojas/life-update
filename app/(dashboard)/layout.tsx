"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-50">Life Update</h1>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          >
            Logout
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
