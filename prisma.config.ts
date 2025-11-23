// Prisma 7 configuration file (for linter compatibility)
// This file exists to satisfy Prisma 7 linter requirements
// Prisma 6.17.1 doesn't use this file - it requires url in schema.prisma
// When upgrading to Prisma 7 (Node.js 20.19+ required):
//   1. Remove url from prisma/schema.prisma
//   2. Update this file to use: import { defineConfig } from "prisma"
//   3. Run: npm install prisma@latest @prisma/client@latest

// @ts-ignore - Prisma 6 doesn't support this file format
export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

