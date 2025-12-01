import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Creates Prisma client instance with logging in development
// Connection URL is read from DATABASE_URL env variable (Prisma 7 style)
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"] // Only log errors and warnings, not all queries
        : ["error"],
  });
};

// Uses global instance in development to prevent multiple connections during hot reload
export const prisma: PrismaClient =
  global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
