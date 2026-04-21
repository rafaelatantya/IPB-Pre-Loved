import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.js",
  out: "./drizzle/migrations", // Drizzle akan menyimpan instruksi generate SQL kemari
});
