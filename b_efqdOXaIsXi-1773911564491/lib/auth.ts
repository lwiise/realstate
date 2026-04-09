import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { isRemoteDatabaseConfigured, executeRemote, queryRemoteRow } from "@/lib/remote-db";

const SESSION_COOKIE_NAME = "mdk_admin_session";
const SESSION_DURATION_DAYS = 14;
let remoteAuthWarningShown = false;

export class AdminAuthUnavailableError extends Error {
  constructor(message = "Le stockage de l’authentification admin est indisponible.") {
    super(message);
    this.name = "AdminAuthUnavailableError";
  }
}

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

function formatErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Erreur d’authentification admin inconnue";
}

function logRemoteAuthFailure(error: unknown) {
  if (remoteAuthWarningShown) {
    return;
  }

  remoteAuthWarningShown = true;
  console.error(`[auth] Remote admin auth failed. ${formatErrorMessage(error)}`);
}

function toAdminAuthUnavailableError(error: unknown) {
  if (error instanceof AdminAuthUnavailableError) {
    return error;
  }

  logRemoteAuthFailure(error);
  return new AdminAuthUnavailableError(formatErrorMessage(error));
}

export function isAdminAuthUnavailableError(error: unknown): error is AdminAuthUnavailableError {
  return error instanceof AdminAuthUnavailableError;
}

export async function countAdminUsers() {
  if (useRemoteAuth()) {
    try {
      const result = await queryRemoteRow<{ count: string }>(
        "SELECT COUNT(*)::text as count FROM admin_users"
      );
      return Number(result?.count ?? 0);
    } catch (error) {
      throw toAdminAuthUnavailableError(error);
    }
  }

  const db = getDb();
  const result = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as { count: number };
  return result.count;
}

export async function getAdminAuthStatus() {
  try {
    const count = await countAdminUsers();
    return {
      available: true,
      hasUsers: count > 0,
      message: "",
    };
  } catch (error) {
    if (!isAdminAuthUnavailableError(error)) {
      throw error;
    }

    return {
      available: false,
      hasUsers: false,
      message:
        "Le panneau d’administration ne peut pas se connecter à sa base de données pour le moment. Vérifiez DATABASE_URL et les variables d’environnement Supabase dans Netlify, puis redéployez.",
    };
  }
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawSession) {
    return null;
  }

  if (useRemoteAuth()) {
    try {
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
    } catch (error) {
      logRemoteAuthFailure(error);
      return null;
    }
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
    throw new Error("Un administrateur existe déjà.");
  }

  const timestamp = new Date().toISOString();

  if (useRemoteAuth()) {
    try {
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
    } catch (error) {
      throw toAdminAuthUnavailableError(error);
    }
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
    try {
      await executeRemote(
        `
          INSERT INTO admin_sessions (user_id, token_hash, expires_at, created_at)
          VALUES ($1, $2, $3, $4)
        `,
        [userId, hashToken(token), expiresAt.toISOString(), now().toISOString()]
      );
    } catch (error) {
      throw toAdminAuthUnavailableError(error);
    }
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
    try {
      const user = await queryRemoteRow<{ id: number; password_hash: string }>(
        "SELECT id, password_hash FROM admin_users WHERE email = $1",
        [normalizedEmail]
      );

      if (!user || !verifyPassword(input.password, user.password_hash)) {
        return false;
      }

      await createSessionForUser(user.id);
      return true;
    } catch (error) {
      throw toAdminAuthUnavailableError(error);
    }
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
    try {
      await executeRemote("DELETE FROM admin_sessions WHERE token_hash = $1", [hashToken(rawSession)]);
    } catch (error) {
      throw toAdminAuthUnavailableError(error);
    }
  } else {
    const db = getDb();
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(hashToken(rawSession));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
