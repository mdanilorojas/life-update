"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid password");
        setIsLoading(false);
        return;
      }

      // Success - redirect to dashboard
      router.push("/daily");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 shadow-xl">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              Life Update
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Track your transformation. No bullshit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-950 border border-red-900 rounded-md">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-200"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
                className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-medium disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Enter"}
            </Button>
          </form>

          <p className="text-xs text-zinc-500 text-center mt-6">
            Single user. One mission. No compromises.
          </p>
        </div>
      </Card>
    </div>
  );
}
