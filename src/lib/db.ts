import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as { _prisma?: InstanceType<typeof PrismaClient> };

export function getDb(): InstanceType<typeof PrismaClient> {
  if (!globalForPrisma._prisma) {
    const dbPath = path.resolve(process.cwd(), "dev.db");
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    globalForPrisma._prisma = new (PrismaClient as any)({ adapter });
  }
  return globalForPrisma._prisma!;
}

export const prisma = new Proxy({} as InstanceType<typeof PrismaClient>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});
