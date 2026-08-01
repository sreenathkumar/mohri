import { PrismaClient } from '@prisma/client'

// Declare a global type to attach the Prisma client to `globalThis` in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Reuse existing instance if present, or create a new one
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Attach to `globalThis` only in non-production environments
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
export { Prisma, OrderStatus, type Order } from "@prisma/client";
export default prisma;