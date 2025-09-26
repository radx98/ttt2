import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if(!process.env.DATABASE_URL) throw Error("NO DATABASE URL FOUND! :)")

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
