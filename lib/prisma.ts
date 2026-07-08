import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

export const prisma =
  global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}