import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.js",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: "./local-db-info/v3/d1/miniflare-D1DatabaseObject/c363b485344cbac4437777baa13ffa4421ed80005fcaed87d6d1063f3c9bf1f7.sqlite",
  },
});
