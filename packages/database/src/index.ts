export {
  PrismaClient,
  type Customer,
  type Conversation,
  type Message,
  type Prisma
} from "@prisma/client";

export { 
  connectDatabase, 
  disconnectDatabase, 
  prisma,
  supabase,
  db,
  DatabaseClient,
  createSupabaseClient,
  createSupabaseServerClient,
  type SupabaseClient
} from "./client";
