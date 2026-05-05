"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface FormState {
  energy_level: number;
  stress_level: number;
  physical_pain: boolean;
  pain_location: string;
  trained_today: boolean;
  deep_work_hours: number;
  clean_today: boolean;
  quick_note: string;
}

export function DailyEntryForm() {
  const [formData, setFormData] = useState<FormState>({
    energy_level: 5,
    stress_level: 5,
    physical_pain: false,
    pain_location: "",
    trained_today: false,
    deep_work_hours: 0,
    clean_today: true,
    quick_note: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/daily-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save entry");
      }

      setMessage({
        type: "success",
        text: "Entry logged successfully!",
      });

      // Reset form to defaults after success
      setFormData({
        energy_level: 5,
        stress_level: 5,
        physical_pain: false,
        pain_location: "",
        trained_today: false,
        deep_work_hours: 0,
        clean_today: true,
        quick_note: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save entry",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-950 border-green-900 text-green-200"
              : "bg-red-950 border-red-900 text-red-200"
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Energy Level Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="energy_level" className="text-base text-zinc-50">
            Energy Level
          </Label>
          <span className="text-lg font-bold text-zinc-50">
            {formData.energy_level}
          </span>
        </div>
        <Slider
          id="energy_level"
          min={1}
          max={10}
          step={1}
          value={[formData.energy_level]}
          onValueChange={(value) => {
            const newValue = Array.isArray(value) ? value[0] : value;
            setFormData({ ...formData, energy_level: newValue });
          }}
          className="touch-none"
          aria-label="Energy level from 1 to 10"
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Dead (1)</span>
          <span>Peak (10)</span>
        </div>
      </div>

      {/* Stress Level Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="stress_level" className="text-base text-zinc-50">
            Stress Level
          </Label>
          <span className="text-lg font-bold text-zinc-50">
            {formData.stress_level}
          </span>
        </div>
        <Slider
          id="stress_level"
          min={1}
          max={10}
          step={1}
          value={[formData.stress_level]}
          onValueChange={(value) => {
            const newValue = Array.isArray(value) ? value[0] : value;
            setFormData({ ...formData, stress_level: newValue });
          }}
          className="touch-none"
          aria-label="Stress level from 1 to 10"
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Zen (1)</span>
          <span>Panic (10)</span>
        </div>
      </div>

      {/* Physical Pain Checkbox */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="physical_pain"
            checked={formData.physical_pain}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                physical_pain: checked === true,
                pain_location: checked === true ? formData.pain_location : "",
              })
            }
            className="h-6 w-6 border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-950"
          />
          <Label
            htmlFor="physical_pain"
            className="text-base text-zinc-50 cursor-pointer"
          >
            Physical Pain Today
          </Label>
        </div>

        {/* Pain Location Input (conditional) */}
        {formData.physical_pain && (
          <div className="ml-9 space-y-2">
            <Label htmlFor="pain_location" className="text-sm text-zinc-400">
              Where? (optional)
            </Label>
            <Input
              id="pain_location"
              type="text"
              placeholder="e.g., lower back, right knee"
              value={formData.pain_location}
              onChange={(e) =>
                setFormData({ ...formData, pain_location: e.target.value })
              }
              className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
            />
          </div>
        )}
      </div>

      {/* Trained Today Checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="trained_today"
          checked={formData.trained_today}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, trained_today: checked === true })
          }
          className="h-6 w-6 border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-950"
        />
        <Label
          htmlFor="trained_today"
          className="text-base text-zinc-50 cursor-pointer"
        >
          Trained Today
        </Label>
      </div>

      {/* Deep Work Hours Input */}
      <div className="space-y-2">
        <Label htmlFor="deep_work_hours" className="text-base text-zinc-50">
          Deep Work Hours
        </Label>
        <Input
          id="deep_work_hours"
          type="number"
          min="0"
          max="12"
          step="0.5"
          value={formData.deep_work_hours}
          onChange={(e) =>
            setFormData({
              ...formData,
              deep_work_hours: parseFloat(e.target.value) || 0,
            })
          }
          className="bg-zinc-800 border-zinc-700 text-zinc-50 text-lg h-12"
        />
        <p className="text-xs text-zinc-500">
          Focused, uninterrupted work (0-12 hours)
        </p>
      </div>

      {/* Clean Today Checkbox */}
      <div className="flex items-center space-x-3">
        <Checkbox
          id="clean_today"
          checked={formData.clean_today}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, clean_today: checked === true })
          }
          className="h-6 w-6 border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-950"
        />
        <Label
          htmlFor="clean_today"
          className="text-base text-zinc-50 cursor-pointer"
        >
          Clean Today
        </Label>
      </div>

      {/* Quick Note Textarea */}
      <div className="space-y-2">
        <Label htmlFor="quick_note" className="text-base text-zinc-50">
          Quick Note (optional)
        </Label>
        <Textarea
          id="quick_note"
          placeholder="Any wins, losses, or insights..."
          value={formData.quick_note}
          onChange={(e) =>
            setFormData({ ...formData, quick_note: e.target.value })
          }
          maxLength={500}
          rows={4}
          className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 resize-none"
        />
        <p className="text-xs text-zinc-500 text-right">
          {formData.quick_note.length}/500
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold text-base disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Log Entry"}
      </Button>
    </form>
  );
}
