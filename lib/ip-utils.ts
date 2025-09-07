
import crypto from 'crypto'
import { headers } from 'next/headers'

export function getClientIP(): string {
  const headersList = headers()
  
  // Try various headers for getting the real client IP
  const forwarded = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const cfIP = headersList.get('cf-connecting-ip')
  const remoteAddr = headersList.get('x-forwarded-for')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfIP) {
    return cfIP
  }
  
  if (remoteAddr) {
    return remoteAddr
  }
  
  // Fallback for development
  return '127.0.0.1'
}

export function createFingerprint(ip: string, userAgent: string): string {
  // Create a hash of IP + User Agent for unique identification
  const data = `${ip}-${userAgent}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function isValidIP(ip: string): boolean {
  // Basic IP validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === '127.0.0.1' || ip === '::1'
}
