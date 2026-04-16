import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export const getDb = (env) => {
  return drizzle(env.DB, { schema }); // 'DB' sesuai binding di wrangler.toml
};