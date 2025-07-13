export {
  PrismaClient,
  type Customer,
  type MastraMessage,
  type MastraThread,
  type Prisma
} from "@prisma/client";
export { connectDatabase, disconnectDatabase, prisma } from "./client";
