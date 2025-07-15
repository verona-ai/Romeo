import type { Customer, Conversation, Message } from ".prisma/client";
import { PrismaClient } from ".prisma/client";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

declare global {
  var __prisma: PrismaClient | undefined;
  var __supabase: SupabaseClient | undefined;
}

// Prisma Client
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Supabase Client (for server-side operations)
export const supabase =
  globalThis.__supabase ||
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

if (process.env.NODE_ENV !== "production") {
  globalThis.__supabase = supabase;
}

// Client factory for different contexts
export const createSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const createSupabaseServerClient = (cookieHandler?: {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options?: any) => void;
  remove: (name: string, options?: any) => void;
}) => {
  if (cookieHandler) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookieHandler
      }
    );
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// Database connection functions
export async function connectDatabase() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");
    
    // Test Supabase connection
    const { data, error } = await supabase.from('_prisma_migrations').select('id').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is expected for some setups
      console.warn("⚠️  Supabase connection test failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

// Unified database operations
export class DatabaseClient {
  private prisma: PrismaClient;
  private supabase: SupabaseClient;

  constructor(prismaClient = prisma, supabaseClient = supabase) {
    this.prisma = prismaClient;
    this.supabase = supabaseClient;
  }

  // Prisma operations (business data)
  get customers() {
    return this.prisma.customer;
  }

  get conversations() {
    return this.prisma.conversation;
  }

  get messages() {
    return this.prisma.message;
  }

  // Supabase operations (auth & real-time)
  get auth() {
    return this.supabase.auth;
  }

  get storage(): any {
    return this.supabase.storage;
  }

  // Unified operations
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getCustomerByEmail(email: string) {
    return await this.prisma.customer.findUnique({
      where: { email },
      include: {
        conversations: {
          include: {
            messages: true
          }
        }
      }
    });
  }

  async createCustomerConversation(customerId: string, title?: string) {
    return await this.prisma.conversation.create({
      data: {
        customerId,
        title: title || null,
        status: 'ACTIVE'
      },
      include: {
        customer: true,
        messages: true
      }
    });
  }

  async addMessage(conversationId: string, content: string, role: 'USER' | 'ASSISTANT' | 'SYSTEM') {
    return await this.prisma.message.create({
      data: {
        conversationId,
        content,
        role
      }
    });
  }

  // Real-time subscriptions
  subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'Message',
          filter: `conversationId=eq.${conversationId}`
        }, 
        callback
      )
      .subscribe();
  }

  // Transaction support
  async transaction<T>(fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }
}

// Export default instance
export const db = new DatabaseClient();

// Export types
export type { Customer, Conversation, Message };
export type { SupabaseClient } from '@supabase/supabase-js';
