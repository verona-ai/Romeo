import { Platform } from './platform.js';

export interface User {
  id: string;
  platform: Platform;
  platformUserId: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  isBot?: boolean;
  language?: string;
  timezone?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  lastActiveAt?: Date;
}

export interface UserProfile {
  displayName: string;
  bio?: string;
  website?: string;
  location?: string;
  verified?: boolean;
  followerCount?: number;
} 