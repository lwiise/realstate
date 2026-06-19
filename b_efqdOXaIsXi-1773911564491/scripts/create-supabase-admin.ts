// Create (or reset the password of) an admin user in Supabase Auth.
//
// Admin login uses Supabase Auth, so admins live in Supabase's auth.users — not in the
// app's database. This script uses the service-role key to provision them from the CLI,
// as an alternative to the Supabase dashboard (Authentication > Users > Add user).
//
// Usage (run from the project folder):
//   pnpm admin:create anaskaroti@gmail.com
//   ADMIN_NEW_PASSWORD='...' pnpm admin:create anaskaroti@gmail.com
//
// The password may come from (in order): ADMIN_NEW_PASSWORD env var, a second CLI
// argument, or an interactive hidden prompt. If the user already exists, their password
// is reset; otherwise the user is created with a confirmed email so they can sign in
// immediately.
//
// Requires in the environment:
//   NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";

const MIN_PASSWORD_LENGTH = 8;

// Control characters the hidden prompt reacts to (defined via char code to keep the
// source free of literal control bytes).
const CTRL_C = String.fromCharCode(3);
const CTRL_D = String.fromCharCode(4);
const BACKSPACE = String.fromCharCode(127);

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function promptHiddenPassword(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    if (!stdin.isTTY) {
      reject(
        new Error(
          "No password provided. Set ADMIN_NEW_PASSWORD or pass it as the second argument."
        )
      );
      return;
    }

    stdout.write(query);
    stdin.resume();
    stdin.setRawMode(true);

    let input = "";
    const onData = (chunk: Buffer) => {
      const char = chunk.toString("utf8");
      if (char === "\n" || char === "\r" || char === CTRL_D) {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(input);
        return;
      }
      if (char === CTRL_C) {
        stdin.setRawMode(false);
        stdout.write("\n");
        process.exit(1);
        return;
      }
      if (char === BACKSPACE || char === "\b") {
        input = input.slice(0, -1);
        return;
      }
      input += char;
    };

    stdin.on("data", onData);
  });
}

async function resolvePassword(argPassword: string | undefined) {
  const fromEnvOrArg = process.env.ADMIN_NEW_PASSWORD || argPassword;
  const password = fromEnvOrArg || (await promptHiddenPassword("New password: "));

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (!fromEnvOrArg && process.stdin.isTTY) {
    const confirm = await promptHiddenPassword("Confirm new password: ");
    if (confirm !== password) {
      throw new Error("Passwords do not match.");
    }
  }

  return password;
}

async function findUserByEmail(
  admin: ReturnType<typeof createClient>["auth"]["admin"],
  email: string
) {
  // Supabase has no get-by-email admin call, so page through users and match. Admin
  // panels have a handful of users, so a single large page is plenty.
  let page = 1;
  const perPage = 1000;

  for (;;) {
    const { data, error } = await admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }

    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) {
      return match;
    }

    if (data.users.length < perPage) {
      return null;
    }
    page += 1;
  }
}

async function main() {
  const rawEmail = process.argv[2];
  if (!rawEmail) {
    throw new Error("Usage: pnpm admin:create <email> [password]  (or set ADMIN_NEW_PASSWORD)");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const email = normalizeEmail(rawEmail);
  const password = await resolvePassword(process.argv[3]);

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const existing = await findUserByEmail(supabase.auth.admin, email);

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      throw error;
    }
    console.log(`Password reset for existing Supabase admin <${email}>.`);
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    throw error;
  }
  console.log(`Created Supabase admin <${email}>. They can now sign in at /admin/login.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
