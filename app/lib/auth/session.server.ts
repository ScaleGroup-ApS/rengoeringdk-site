import { createCookieSessionStorage } from "react-router";

// In production a real secret MUST be provided. Fail fast rather than sign
// sessions with a predictable key.
const secret = process.env.SESSION_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET is required in production");
}

type SessionData = {
  userId: number;
  // Snapshot of app_users.token_version — lets us invalidate all sessions for
  // a user by bumping the column.
  tokenVersion: number;
};

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__define_session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    secrets: [secret ?? "dev-insecure-secret"],
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
