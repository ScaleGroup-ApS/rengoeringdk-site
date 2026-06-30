import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

// Async scrypt — never block the single Node event loop (the marketing site
// shares this process and the pod has a tight CPU limit). promisify's inferred
// signature drops the options overload, so we type it explicitly.
const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options?: ScryptOptions,
) => Promise<Buffer>;

const KEYLEN = 64;
const SALT_BYTES = 16;
// scrypt cost parameter. 2^15 is a sensible interactive default.
const N = 16384;

/**
 * Hash a plaintext password. Format: `scrypt$<N>$<saltHex>$<hashHex>`.
 * Encoding the params lets us tune cost later without breaking old hashes.
 */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(plain, salt, KEYLEN, { N });
  return `scrypt$${N}$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/** Constant-time verify a plaintext password against a stored hash. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;

  const cost = Number(parts[1]);
  const salt = Buffer.from(parts[2], "hex");
  const expected = Buffer.from(parts[3], "hex");
  if (!Number.isFinite(cost) || salt.length === 0 || expected.length === 0) return false;

  const derived = await scrypt(plain, salt, expected.length, { N: cost });
  // timingSafeEqual throws on length mismatch — guard first.
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
