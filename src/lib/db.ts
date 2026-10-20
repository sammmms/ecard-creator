import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function initDatabaseUrl() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = "/tmp/app.db";
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "app.db"),
        path.join(process.cwd(), "data", "app.db"),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (e) {
            console.error("Failed to copy database to /tmp:", e);
          }
        }
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
}

initDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const db = globalForPrisma.prisma ?? new PrismaClient();

export default db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
