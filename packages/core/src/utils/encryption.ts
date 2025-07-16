import { createHmac, randomBytes, createHash } from 'crypto';

export function generateWebhookSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

export function verifyWebhookSignature(
  payload: string, 
  signature: string, 
  secret: string,
  algorithm: 'sha1' | 'sha256' = 'sha256'
): boolean {
  const expectedSignature = createHmac(algorithm, secret)
    .update(payload)
    .digest('hex');
  
  // Use constant-time comparison to prevent timing attacks
  return timingSafeEqual(signature, expectedSignature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function generateVerificationCode(length: number = 6): string {
  const chars = '0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const middle = '*'.repeat(data.length - visibleChars * 2);
  
  return start + middle + end;
}

// Platform-specific signature verification
export function verifyWhatsAppSignature(payload: string, signature: string, secret: string): boolean {
  // WhatsApp uses SHA256 with 'sha256=' prefix
  const cleanSignature = signature.replace('sha256=', '');
  return verifyWebhookSignature(payload, cleanSignature, secret, 'sha256');
}

export function verifyTelegramSignature(payload: string, signature: string, botToken: string): boolean {
  // Telegram uses SHA256 HMAC
  return verifyWebhookSignature(payload, signature, botToken, 'sha256');
}

export function verifySlackSignature(
  payload: string, 
  signature: string, 
  secret: string, 
  timestamp: string
): boolean {
  // Slack uses a timestamp + payload signature
  const baseString = `v0:${timestamp}:${payload}`;
  const expectedSignature = `v0=${createHmac('sha256', secret).update(baseString).digest('hex')}`;
  
  return timingSafeEqual(signature, expectedSignature);
} 