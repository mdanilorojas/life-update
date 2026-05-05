// /lib/session.ts
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { CURRENT_USER_ID } from "./constants";

const SESSION_COOKIE_NAME = "life-update-session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

const sessions = new Map<string, { userId: string; createdAt: Date }>();

export async function createSession(): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");

  // Store session server-side
  sessions.set(sessionId, {
    userId: CURRENT_USER_ID,
    createdAt: new Date(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return sessionId;
}

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function deleteSession(): Promise<void> {
  const sessionId = await getSession();
  if (sessionId) {
    sessions.delete(sessionId);
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function validateSession(sessionId: string): Promise<boolean> {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Check if session expired
  const expiresAt = new Date(session.createdAt.getTime() + SESSION_MAX_AGE * 1000);
  if (expiresAt < new Date()) {
    sessions.delete(sessionId);
    return false;
  }

  return true;
}

export async function isAuthenticated(): Promise<boolean> {
  const sessionId = await getSession();
  if (!sessionId) return false;
  return validateSession(sessionId);
}
