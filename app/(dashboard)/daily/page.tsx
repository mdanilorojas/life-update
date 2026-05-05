import { DailyEntryForm } from "@/components/forms/DailyEntryForm";

export default function DailyEntryPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Daily Check-In</h1>
        <p className="text-sm text-zinc-400 mt-1">{today}</p>
      </div>
      <DailyEntryForm />
    </div>
  );
}
