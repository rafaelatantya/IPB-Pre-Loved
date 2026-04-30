import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { getRequestContext } from "@cloudflare/next-on-pages";

export const getDb = (env) => {
  return drizzle(env.DB, { schema }); // 'DB' sesuai binding di wrangler.toml
};

/**
 * Helper to get DB environment safely
 */
export const getEnv = async () => {
    // 1. Coba ambil dari request context (Wrangler/Production)
    const context = getRequestContext();
    if (context && context.env) {
      return context.env;
    }

    // 2. Fallback ke process.env (Next.js Dev Server dengan setupDevPlatform)
    if (process.env) {
      return process.env;
    }

    throw new Error("Cloudflare Environment not found.");
};

/**
 * Helper to get Database instance within Server Actions
 */
export const getContextDb = async () => {
  try {
    const env = await getEnv();
    if (!env.DB) {
      throw new Error("D1 Database binding 'DB' not found in environment.");
    }
    return getDb(env);
  } catch (err) {
    console.error("DEBUG [getContextDb]:", err.message);
    throw err;
  }
};

