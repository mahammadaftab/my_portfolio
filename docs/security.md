# Security Implementation Guide

This guide provides detailed information about implementing and maintaining security best practices for the portfolio website to protect both the application and its users.

## Table of Contents

1. [Overview](#overview)
2. [Content Security Policy](#content-security-policy)
3. [Cross-Site Scripting (XSS) Protection](#cross-site-scripting-xss-protection)
4. [Cross-Site Request Forgery (CSRF) Protection](#cross-site-request-forgery-csrf-protection)
5. [Input Validation and Sanitization](#input-validation-and-sanitization)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Secure Headers](#secure-headers)
8. [Rate Limiting](#rate-limiting)
9. [Data Protection](#data-protection)
10. [Dependency Security](#dependency-security)
11. [Environment Variables](#environment-variables)
12. [Security Testing](#security-testing)
13. [Monitoring and Logging](#monitoring-and-logging)
14. [Incident Response](#incident-response)
15. [Best Practices](#best-practices)
16. [Resources](#resources)

## Overview

The portfolio website implements comprehensive security measures to ensure:

- **Protection against common web vulnerabilities**: XSS, CSRF, injection attacks
- **Secure data handling**: Proper validation, sanitization, and encryption
- **Robust authentication**: Secure user authentication and authorization
- **Compliance with security standards**: Following industry best practices
- **Continuous monitoring**: Ongoing security assessment and monitoring
- **Incident response preparedness**: Plans for handling security incidents

## Content Security Policy

### CSP Implementation

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https: https://www.google-analytics.com;
              font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
              connect-src 'self' https://www.google-analytics.com;
              media-src 'self';
              object-src 'none';
              child-src 'self';
              frame-ancestors 'none';
              form-action 'self';
              base-uri 'self';
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Dynamic CSP for Development

```typescript
// src/lib/csp.ts
export function getCSP(isDev: boolean) {
  const baseCSP = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"} https://www.google-analytics.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: https://www.google-analytics.com;
    font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
    connect-src 'self' https://www.google-analytics.com;
    media-src 'self';
    object-src 'none';
    child-src 'self';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();
  
  return baseCSP;
}
```

## Cross-Site Scripting (XSS) Protection

### Input Sanitization

```typescript
// src/lib/sanitization.ts
import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
}

export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    },
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { 
        rel: 'noopener noreferrer',
        target: '_blank'
      })
    }
  });
}
```

### Safe String Interpolation

```tsx
// src/components/safe-content.tsx
import DOMPurify from 'dompurify';

export function SafeContent({ content }: { content: string }) {
  if (typeof window === 'undefined') {
    // Server-side rendering - return plain text
    return <div>{content}</div>;
  }
  
  const cleanContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
}
```

### React Security Best Practices

```tsx
// src/components/secure-link.tsx
export function SecureLink({ href, children }: { href: string; children: React.ReactNode }) {
  // Validate URL
  try {
    const url = new URL(href);
    if (url.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch (error) {
    console.error('Invalid URL:', href);
    return <span>{children}</span>;
  }
  
  return (
    <a 
      href={href} 
      rel="noopener noreferrer" 
      target="_blank"
    >
      {children}
    </a>
  );
}
```

## Cross-Site Request Forgery (CSRF) Protection

### CSRF Token Implementation

```typescript
// src/lib/csrf.ts
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function setCSRFToken() {
  const token = generateCSRFToken();
  cookies().set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  });
  return token;
}

export function verifyCSRFToken(token: string): boolean {
  const storedToken = cookies().get('csrf-token')?.value;
  return storedToken === token;
}
```

### API Route CSRF Protection

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { verifyCSRFToken } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { csrfToken, ...data } = body;
    
    // Verify CSRF token
    if (!verifyCSRFToken(csrfToken)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
    
    // Process the form data
    // ... rest of the implementation
    
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

### Client-Side CSRF Token Handling

```tsx
// src/components/contact-form.tsx
"use client";

import { useState, useEffect } from "react";

export function ContactForm() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  
  useEffect(() => {
    // Fetch CSRF token from API
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        csrfToken
      })
    });
    
    // Handle response
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Input Validation and Sanitization

### Zod Schema Validation

```typescript
// src/lib/validation.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  
  email: z.string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Project schema
export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  tags: z.array(z.string().min(1).max(50)).max(10),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional()
});
```

### Server-Side Validation

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: validatedData.error.flatten()
        },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = validatedData.data;
    
    // Process validated data
    // ... rest of implementation
    
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

### File Upload Validation

```typescript
// src/lib/file-validation.ts
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'File type not allowed' 
    };
  }
  
  return { valid: true };
}
```

## Authentication and Authorization

### Session Management

```typescript
// src/lib/auth.ts
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';

const secretKey = process.env.SESSION_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export function setSession(token: string) {
  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  
  try {
    const decrypted = await decrypt(session);
    return decrypted;
  } catch {
    return null;
  }
}
```

### Protected Routes

```typescript
// src/lib/auth-middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function authMiddleware(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Usage in middleware.ts
import { authMiddleware } from '@/lib/auth-middleware';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/admin', '/dashboard'];
  const isProtected = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected) {
    return authMiddleware(request);
  }
  
  return NextResponse.next();
}
```

### Password Security

```typescript
// src/lib/password.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
```

## Secure Headers

### Comprehensive Security Headers

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';"
          },
          
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          
          // XSS protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          
          // Referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), interest-cohort=()"
          },
          
          // Strict transport security
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Environment-Specific Headers

```typescript
// src/lib/security-headers.ts
export function getSecurityHeaders(isDev: boolean) {
  const headers = [
    {
      key: "X-Content-Type-Options",
      value: "nosniff"
    },
    {
      key: "X-Frame-Options",
      value: "DENY"
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block"
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin"
    }
  ];
  
  // Add HSTS only in production
  if (!isDev) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload"
    });
  }
  
  return headers;
}
```

## Rate Limiting

### API Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter for contact form
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### Rate Limiting in API Routes

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Get IP address
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  // Check rate limit
  const isAllowed = await checkRateLimit(`contact_${ip}`);
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  
  // Continue with normal processing
  try {
    // ... rest of implementation
  } catch (error) {
    // Error handling
  }
}
```

### Custom Rate Limiting

```typescript
// src/lib/custom-rate-limit.ts
import { cookies } from 'next/headers';

export class RateLimiter {
  private static readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_REQUESTS = 100;
  
  static async isAllowed(identifier: string): Promise<boolean> {
    const key = `rate_limit_${identifier}`;
    const cookieStore = cookies();
    const rateLimitData = cookieStore.get(key)?.value;
    
    if (!rateLimitData) {
      // First request
      this.setRateLimitData(key, { count: 1, resetTime: Date.now() + this.WINDOW_MS });
      return true;
    }
    
    const { count, resetTime } = JSON.parse(rateLimitData);
    
    if (Date.now() > resetTime) {
      // Window has expired
      this.setRateLimitData(key, { count: 1, resetTime: Date.now() + this.WINDOW_MS });
      return true;
    }
    
    if (count >= this.MAX_REQUESTS) {
      // Rate limit exceeded
      return false;
    }
    
    // Increment count
    this.setRateLimitData(key, { count: count + 1, resetTime });
    return true;
  }
  
  private static setRateLimitData(key: string, data: any) {
    cookies().set(key, JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.WINDOW_MS / 1000,
      path: '/'
    });
  }
}
```

## Data Protection

### Encryption

```typescript
// src/lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  cipher.setAutoPadding(true);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText: string): string {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encrypted = textParts.join(':');
  
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  decipher.setAutoPadding(true);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Environment Variable Protection

```typescript
// src/lib/config.ts
export const config = {
  // Public configuration
  public: {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Portfolio',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api'
  },
  
  // Private configuration (server-side only)
  private: {
    databaseUrl: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY
  }
};
```

### Data Validation

```typescript
// src/lib/data-validation.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
```

## Dependency Security

### Dependency Auditing

```bash
# Audit dependencies for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix all vulnerabilities (may break dependencies)
npm audit fix --force

# Check outdated dependencies
npm outdated
```

### Package Lock Validation

```json
// package-lock.json validation in CI
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:check": "npm outdated && npm audit"
  }
}
```

### Dependency Management

```javascript
// .npmrc
# Security settings
audit=true
fund=false

# Strict engine requirements
engine-strict=true
```

### Third-Party Script Security

```tsx
// src/components/secure-script.tsx
import Script from "next/script";

export function SecureScript({ src, strategy = "lazyOnload" }: { 
  src: string; 
  strategy?: "lazyOnload" | "afterInteractive" | "beforeInteractive" 
}) {
  // Validate script source
  try {
    const url = new URL(src);
    if (!['https:'].includes(url.protocol)) {
      throw new Error('Invalid script protocol');
    }
    
    // Allow only trusted domains
    const trustedDomains = [
      'www.google-analytics.com',
      'www.googletagmanager.com'
    ];
    
    if (!trustedDomains.some(domain => url.hostname.includes(domain))) {
      console.warn('Blocked external script:', src);
      return null;
    }
  } catch (error) {
    console.error('Invalid script URL:', src);
    return null;
  }
  
  return (
    <Script 
      src={src} 
      strategy={strategy}
      onError={(e) => console.error('Script load error:', e)}
    />
  );
}
```

## Environment Variables

### Secure Environment Configuration

```bash
# .env.local (never commit to version control)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
JWT_SECRET=your-super-secret-jwt-key-here
ENCRYPTION_KEY=your-32-character-encryption-key-here
RESEND_API_KEY=your-resend-api-key-here
NEXT_PUBLIC_SITE_URL=https://your-portfolio.com
```

### Environment Variable Validation

```typescript
// src/lib/env-validation.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(32),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1)
});

export function validateEnvironment() {
  try {
    envSchema.parse(process.env);
    return true;
  } catch (error) {
    console.error('Environment validation failed:', error);
    return false;
  }
}

// Run validation at startup
if (typeof window === 'undefined') {
  validateEnvironment();
}
```

### Environment-Specific Configuration

```typescript
// src/lib/config.ts
export const config = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // API endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: parseInt(process.env.API_TIMEOUT || '5000')
  },
  
  // Security settings
  security: {
    csrfProtection: process.env.ENABLE_CSRF_PROTECTION === 'true',
    rateLimiting: process.env.ENABLE_RATE_LIMITING === 'true'
  }
};
```

## Security Testing

### Automated Security Testing

```javascript
// jest.security.js
import { axe } from 'jest-axe';

describe('Security Tests', () => {
  it('should not have XSS vulnerabilities', async () => {
    // Test for XSS in form inputs
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
  
  it('should validate email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
  
  it('should have proper CSP headers', async () => {
    const response = await fetch('/');
    const cspHeader = response.headers.get('content-security-policy');
    expect(cspHeader).toContain("default-src 'self'");
  });
});
```

### Penetration Testing

```bash
# Install security testing tools
npm install --save-dev nmap owasp-zap-cli

# Run basic security scans
nmap -p 80,443 your-portfolio-domain.com
owasp-zap-cli quick-scan https://your-portfolio-domain.com
```

### Security Scanning in CI

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run security audit
      run: npm audit --audit-level=moderate
      
    - name: Run dependency check
      run: npx npx audit-ci --moderate
      
    - name: Run security tests
      run: npm run test:security
```

## Monitoring and Logging

### Security Event Logging

```typescript
// src/lib/security-logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'security.log' }),
    new winston.transports.Console()
  ]
});

export function logSecurityEvent(event: string, data: any) {
  logger.info({
    event,
    data,
    timestamp: new Date().toISOString()
  });
}

export function logSecurityError(event: string, error: any) {
  logger.error({
    event,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
}
```

### Suspicious Activity Monitoring

```typescript
// src/lib/activity-monitor.ts
import { logSecurityEvent } from '@/lib/security-logger';

export class ActivityMonitor {
  static logFailedLogin(ip: string, email: string) {
    logSecurityEvent('failed_login', { ip, email });
    
    // Implement rate limiting or alerting logic
    // ...
  }
  
  static logSuccessfulLogin(ip: string, email: string) {
    logSecurityEvent('successful_login', { ip, email });
  }
  
  static logSuspiciousActivity(ip: string, activity: string) {
    logSecurityEvent('suspicious_activity', { ip, activity });
    
    // Send alert to security team
    // ...
  }
}
```

### Error Handling and Logging

```typescript
// src/lib/error-handler.ts
import { logSecurityError } from '@/lib/security-logger';

export function handleSecurityError(error: any, context: string) {
  logSecurityError(context, error);
  
  // Don't expose internal errors to users
  return {
    error: 'An unexpected error occurred',
    statusCode: 500
  };
}

// Usage in API routes
export async function POST(request: Request) {
  try {
    // ... implementation
  } catch (error: any) {
    const { error: userError, statusCode } = handleSecurityError(error, 'contact_form');
    return NextResponse.json({ error: userError }, { status: statusCode });
  }
}
```

## Incident Response

### Security Incident Response Plan

```markdown
# Security Incident Response Plan

## 1. Identification
- Monitor logs for suspicious activity
- Review security alerts from automated tools
- Investigate user reports of security issues

## 2. Containment
- Isolate affected systems
- Disable compromised accounts
- Block malicious IP addresses
- Revoke compromised API keys

## 3. Eradication
- Remove malicious code or files
- Patch vulnerabilities
- Reset compromised passwords
- Update security configurations

## 4. Recovery
- Restore systems from clean backups
- Verify system integrity
- Test functionality
- Monitor for recurrence

## 5. Lessons Learned
- Document the incident
- Identify root causes
- Update security procedures
- Train team members
```

### Emergency Contact Information

```typescript
// src/lib/emergency-contacts.ts
export const emergencyContacts = {
  securityTeam: [
    {
      name: 'Security Lead',
      email: 'security@your-portfolio.com',
      phone: '+1-555-0123'
    }
  ],
  hostingProvider: {
    name: 'Vercel Support',
    url: 'https://vercel.com/support'
  },
  domainRegistrar: {
    name: 'Domain Registrar',
    url: 'https://your-registrar.com/support'
  }
};
```

### Backup and Recovery

```bash
# Automated backup script
#!/bin/bash
# backup.sh

# Database backup
pg_dump -h localhost -U portfolio_user portfolio_db > backups/portfolio_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf backups/files_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads

# Prune old backups (keep last 30 days)
find backups/ -name "*.sql" -mtime +30 -delete
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

## Best Practices

### Security Development Lifecycle

1. **Threat Modeling**: Identify potential security threats during design
2. **Secure Coding**: Follow secure coding practices
3. **Code Review**: Include security review in code review process
4. **Testing**: Include security testing in CI/CD pipeline
5. **Deployment**: Use secure deployment practices
6. **Monitoring**: Continuously monitor for security issues
7. **Response**: Have incident response plans ready

### Secure Coding Guidelines

1. **Input Validation**: Validate all user input
2. **Output Encoding**: Encode output to prevent XSS
3. **Authentication**: Implement strong authentication
4. **Authorization**: Enforce proper authorization
5. **Error Handling**: Don't expose sensitive information in errors
6. **Logging**: Log security-relevant events
7. **Dependencies**: Keep dependencies up to date

### Security Checklist

```markdown
## Security Implementation Checklist

### Authentication & Authorization
- [ ] Strong password requirements
- [ ] Secure session management
- [ ] Role-based access control
- [ ] Multi-factor authentication (if needed)

### Data Protection
- [ ] Encryption at rest
- [ ] Encryption in transit (HTTPS)
- [ ] Secure key management
- [ ] Data backup and recovery

### Input Validation
- [ ] Server-side validation
- [ ] Client-side validation (defense in depth)
- [ ] Sanitization of user input
- [ ] File upload validation

### Security Headers
- [ ] Content Security Policy
- [ ] X-Content-Type-Options
- [ ] X-Frame-Options
- [ ] X-XSS-Protection
- [ ] Strict-Transport-Security

### Rate Limiting
- [ ] API rate limiting
- [ ] Login attempt limiting
- [ ] Form submission limiting

### Monitoring & Logging
- [ ] Security event logging
- [ ] Suspicious activity monitoring
- [ ] Regular security audits
- [ ] Vulnerability scanning
```

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Documentation](https://nextjs.org/docs/app/building-your-application/security)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)