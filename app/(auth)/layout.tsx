import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Life Update",
  description: "Login to your Life Update dashboard",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full w-full flex items-center justify-center bg-zinc-950 px-4 py-12">
      {children}
    </div>
  );
}
