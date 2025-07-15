import { db, prisma, supabase, createSupabaseClient, createSupabaseServerClient } from '@romeo/database'

// Re-export the unified database client and utilities
export { db, prisma, supabase, createSupabaseClient, createSupabaseServerClient }

// Re-export types
export type { Customer, Conversation, Message, SupabaseClient } from '@romeo/database'
