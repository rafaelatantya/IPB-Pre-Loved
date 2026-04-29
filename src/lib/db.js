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
    const context = getRequestContext();
    if (!context || !context.env) {
      throw new Error("Cloudflare Environment not found. Are you running with 'wrangler pages dev'?");
    }
    return context.env;
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

