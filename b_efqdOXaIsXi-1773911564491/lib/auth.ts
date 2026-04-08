import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { isRemoteDatabaseConfigured, executeRemote, queryRemoteRow } from "@/lib/remote-db";

const SESSION_COOKIE_NAME = "mdk_admin_session";
const SESSION_DURATION_DAYS = 14;

function now() {
  return new Date();
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const inputHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(originalHash, "hex");

  return storedBuffer.length === inputHash.length && timingSafeEqual(storedBuffer, inputHash);
}

function useRemoteAuth() {
  return isRemoteDatabaseConfigured();
}

export async function countAdminUsers() {
  if (useRemoteAuth()) {
    const result = await queryRemoteRow<{ count: string }>(
      "SELECT COUNT(*)::text as count FROM admin_users"
    );
    return Number(result?.count ?? 0);
  }

  const db = getDb();
  const result = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as { count: number };
  return result.count;
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawSession) {
    return null;
  }

  if (useRemoteAuth()) {
    const session = await queryRemoteRow<{
      id: number;
      name: string;
      email: string;
      expiresat: string;
    }>(
      `
        SELECT
          admin_users.id,
          admin_users.name,
          admin_users.email,
          admin_sessions.expires_at as expiresAt
        FROM admin_sessions
        INNER JOIN admin_users ON admin_users.id = admin_sessions.user_id
        WHERE admin_sessions.token_hash = $1 AND admin_sessions.expires_at > $2
      `,
      [hashToken(rawSession), new Date().toISOString()]
    );

    if (!session) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return {
      id: Number(session.id),
      name: session.name,
      email: session.email,
      expiresAt: session.expiresat,
    };
  }

  const db = getDb();
  const session = db
    .prepare(
      `
        SELECT
          admin_users.id,
          admin_users.name,
          admin_users.email,
          admin_sessions.expires_at as expiresAt
        FROM admin_sessions
        INNER JOIN admin_users ON admin_users.id = admin_sessions.user_id
        WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ?
      `
    )
    .get(hashToken(rawSession), new Date().toISOString()) as
    | { id: number; name: string; email: string; expiresAt: string }
    | undefined;

  if (!session) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session;
}

export async function requireAdminUser() {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function createInitialAdminUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  if ((await countAdminUsers()) > 0) {
    throw new Error("Admin user already exists.");
  }

  const timestamp = new Date().toISOString();

  if (useRemoteAuth()) {
    const result = await queryRemoteRow<{ id: number }>(
      `
        INSERT INTO admin_users (name, email, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      [
        input.name.trim(),
        normalizeEmail(input.email),
        hashPassword(input.password),
        timestamp,
        timestamp,
      ]
    );

    return Number(result?.id ?? 0);
  }

  const db = getDb();
  const result = db
    .prepare(
      `
        INSERT INTO admin_users (name, email, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(
      input.name.trim(),
      normalizeEmail(input.email),
      hashPassword(input.password),
      timestamp,
      timestamp
    );

  return Number(result.lastInsertRowid);
}

async function createSessionForUser(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = addDays(now(), SESSION_DURATION_DAYS);

  if (useRemoteAuth()) {
    await executeRemote(
      `
        INSERT INTO admin_sessions (user_id, token_hash, expires_at, created_at)
        VALUES ($1, $2, $3, $4)
      `,
      [userId, hashToken(token), expiresAt.toISOString(), now().toISOString()]
    );
  } else {
    const db = getDb();
    db.prepare(
      `
        INSERT INTO admin_sessions (user_id, token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `
    ).run(userId, hashToken(token), expiresAt.toISOString(), now().toISOString());
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function signInAdmin(input: { email: string; password: string }) {
  const normalizedEmail = normalizeEmail(input.email);

  if (useRemoteAuth()) {
    const user = await queryRemoteRow<{ id: number; password_hash: string }>(
      "SELECT id, password_hash FROM admin_users WHERE email = $1",
      [normalizedEmail]
    );

    if (!user || !verifyPassword(input.password, user.password_hash)) {
      return false;
    }

    await createSessionForUser(user.id);
    return true;
  }

  const db = getDb();
  const user = db
    .prepare("SELECT id, password_hash as passwordHash FROM admin_users WHERE email = ?")
    .get(normalizedEmail) as { id: number; passwordHash: string } | undefined;

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    return false;
  }

  await createSessionForUser(user.id);
  return true;
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawSession) {
    return;
  }

  if (useRemoteAuth()) {
    await executeRemote("DELETE FROM admin_sessions WHERE token_hash = $1", [hashToken(rawSession)]);
  } else {
    const db = getDb();
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(rawSession));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
