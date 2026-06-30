import { redirect } from "react-router";
import { eq } from "drizzle-orm";
import { getDb } from "~/lib/db.server";
import { appUsers } from "~/db/schema";
import { commitSession, destroySession, getSession } from "~/lib/auth/session.server";

export type SessionUser = {
  id: number;
  email: string;
  role: "admin" | "customer";
  navn: string;
  virksomhed: string | null;
  cvr: string | null;
  tlf: string | null;
  adresse: string | null;
  postnr: string | null;
  by: string | null;
  audience: "privat" | "erhverv";
};

/**
 * The single choke point for reading the logged-in user. Keep all cookie
 * reads here so a token-based path (e.g. Capacitor) can be added in one place.
 * Returns null when anonymous or when the session is stale (token_version
 * mismatch / deleted user).
 */
export async function getUser(request: Request): Promise<SessionUser | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) return null;

  const db = getDb();
  const rows = await db.select().from(appUsers).where(eq(appUsers.id, userId)).limit(1);
  const row = rows[0];
  if (!row) return null;

  // Stale session (password reset / forced logout).
  if (session.get("tokenVersion") !== row.tokenVersion) return null;

  return {
    id: row.id,
    email: row.email,
    role: row.role === "admin" ? "admin" : "customer",
    navn: row.navn,
    virksomhed: row.virksomhed ?? null,
    cvr: row.cvr ?? null,
    tlf: row.tlf ?? null,
    adresse: row.adresse ?? null,
    postnr: row.postnr ?? null,
    by: row.by ?? null,
    audience: row.audience === "erhverv" ? "erhverv" : "privat",
  };
}

/** Require a logged-in user or throw a redirect to login (preserving target). */
export async function requireUser(
  request: Request,
  redirectTo = "/app/login",
): Promise<SessionUser> {
  const user = await getUser(request);
  if (!user) {
    const url = new URL(request.url);
    const params = new URLSearchParams({ next: url.pathname + url.search });
    throw redirect(`${redirectTo}?${params}`);
  }
  return user;
}

/** Require an admin or bounce non-admins back to the customer dashboard. */
export async function requireAdmin(request: Request): Promise<SessionUser> {
  const user = await requireUser(request);
  if (user.role !== "admin") throw redirect("/app");
  return user;
}

/** Build a Set-Cookie header that logs a user in. */
export async function createUserSession(
  request: Request,
  userId: number,
  tokenVersion: number,
): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", userId);
  session.set("tokenVersion", tokenVersion);
  return commitSession(session);
}

/** Build a Set-Cookie header that logs the current user out. */
export async function destroyUserSession(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  return destroySession(session);
}
