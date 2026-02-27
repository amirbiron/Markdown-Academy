import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// TiDB Cloud דורש חיבור SSL
const url = new URL(connectionString);
if (!url.searchParams.has("ssl")) {
  url.searchParams.set("ssl", '{"rejectUnauthorized":true}');
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: url.toString(),
  },
});
