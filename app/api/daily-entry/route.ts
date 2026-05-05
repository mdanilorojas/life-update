import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Validation helper
function validateDailyEntryData(data: any) {
  const errors: string[] = [];

  // Required fields
  if (typeof data.energy_level !== "number" || data.energy_level < 1 || data.energy_level > 10) {
    errors.push("energy_level must be a number between 1 and 10");
  }
  if (typeof data.stress_level !== "number" || data.stress_level < 1 || data.stress_level > 10) {
    errors.push("stress_level must be a number between 1 and 10");
  }
  if (typeof data.physical_pain !== "boolean") {
    errors.push("physical_pain must be a boolean");
  }
  if (typeof data.trained_today !== "boolean") {
    errors.push("trained_today must be a boolean");
  }
  if (typeof data.deep_work_hours !== "number" || data.deep_work_hours < 0 || data.deep_work_hours > 12) {
    errors.push("deep_work_hours must be a number between 0 and 12");
  }
  if (typeof data.clean_today !== "boolean") {
    errors.push("clean_today must be a boolean");
  }

  // Optional fields
  if (data.pain_location !== null && data.pain_location !== undefined && typeof data.pain_location !== "string") {
    errors.push("pain_location must be a string or null");
  }
  if (data.quick_note !== null && data.quick_note !== undefined && typeof data.quick_note !== "string") {
    errors.push("quick_note must be a string or null");
  }

  return errors;
}

// GET handler - retrieve today's entry
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];
    const dateObj = new Date(today);

    // Find today's entry
    const entry = await prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: dateObj,
        },
      },
    });

    return NextResponse.json(
      { entry: entry || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching daily entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler - create or update entry (upsert)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    const body = await request.json();

    // Validate request data
    const validationErrors = validateDailyEntryData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];
    const dateObj = new Date(today);

    // Prepare data for upsert
    const entryData = {
      energy_level: body.energy_level,
      stress_level: body.stress_level,
      physical_pain: body.physical_pain,
      pain_location: body.pain_location || null,
      trained_today: body.trained_today,
      deep_work_hours: body.deep_work_hours,
      clean_today: body.clean_today,
      quick_note: body.quick_note || null,
    };

    // Upsert entry (update if exists for today, create if not)
    const entry = await prisma.dailyEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: dateObj,
        },
      },
      update: entryData,
      create: {
        ...entryData,
        userId,
        date: dateObj,
      },
    });

    return NextResponse.json(
      { entry },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving daily entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
