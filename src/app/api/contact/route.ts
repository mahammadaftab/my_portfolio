import { NextResponse } from "next/server";
import { Resend } from "resend";

// Use Upstash Redis for rate limiting in production, fallback to in-memory
let redis: null | any = null;

if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  try {
    // Dynamically import to avoid issues in development
    const RedisModule = await import("@upstash/redis");
    const Redis = RedisModule.Redis;
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
  } catch (error) {
    console.warn("Failed to initialize Redis:", error);
  }
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10;
  
  if (redis) {
    // Use Redis for rate limiting
    try {
      const key = `rate_limit:${ip}`;
      const current = await redis.get(key);
      
      if (!current) {
        // First request
        await redis.setex(key, windowMs / 1000, 1);
        return true;
      }
      
      if (current >= maxRequests) {
        // Rate limit exceeded
        return false;
      }
      
      // Increment count
      await redis.incr(key);
      return true;
    } catch (error) {
      console.warn("Redis rate limiting failed, falling back to in-memory:", error);
    }
  }
  
  // Fallback to in-memory rate limiting
  const rateLimitStore = (global as any).rateLimitStore || new Map<string, { count: number; resetTime: number }>();
  (global as any).rateLimitStore = rateLimitStore;
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || record.resetTime < now) {
    // First request or window has passed
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    // Rate limit exceeded
    return false;
  }
  
  // Increment count
  rateLimitStore.set(ip, { count: record.count + 1, resetTime: record.resetTime });
  return true;
}

// Initialize Resend client
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const contactEmail = process.env.CONTACT_EMAIL || "contact@example.com";

// Email service configuration
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "console";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@example.com";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Send email using Resend if available, otherwise fallback to console
    if (resend) {
      try {
        await resend.emails.send({
          from: contactEmail,
          to: contactEmail,
          subject: `Contact Form: ${subject}`,
          text: `Name: ${name}
Email: ${email}

Message:
${message}`,
          replyTo: email,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email sending fails, but log it
      }
    } else {
      // Log to console as fallback
      console.log("Contact form submission:", { name, email, subject, message });
    }
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact form error:", error);
    
    // Return appropriate error based on error type
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}