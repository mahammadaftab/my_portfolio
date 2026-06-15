import { NextResponse } from "next/server";
import { Resend } from "resend";

// Use Upstash Redis for rate limiting in production, fallback to in-memory
let redis: null | any = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    // Dynamically import to avoid issues in development
    const RedisModule = await import("@upstash/redis");
    const Redis = RedisModule.Redis;
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
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
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "mdaftabeditz360@gmail.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export async function POST(request: Request) {
  try {
    console.log("Contact form submission received");
    
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    console.log("Request IP:", ip);
    
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      console.log("Rate limit exceeded for IP:", ip);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    console.log("Form data received:", body);
    
    // Honeypot spam check
    const { name, email, company, subject, message, company_verification } = body;
    if (company_verification) {
      console.warn("Spam bot honeypot triggered. Rejecting silently.");
      // Return 200 OK so the spam bot thinks it succeeded, but we don't send emails
      return NextResponse.json({ success: true });
    }
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log("Missing required fields:", { name, email, subject, message });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Send email using Resend if available, otherwise fallback to console
    if (resend) {
      try {
        const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + " IST";
        
        // Render Owner Alert Email (Sent to Portfolio Owner)
        const ownerHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; background-color: #0b071e; color: #f4f4f5;">
            <!-- Header -->
            <div style="padding: 32px 24px; background: linear-gradient(135deg, #1e1b4b, #2e1065); border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">New Portfolio Inquiry</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #a78bfa; font-weight: 600;">🚀 Received from ${name}</p>
            </div>
            
            <!-- Content Body -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #e2e8f0; line-height: 1.5;">Hello Mahammad Aftab,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">You have received a new inquiry through your portfolio website.</p>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin-bottom: 24px;"></div>
              
              <!-- Info List -->
              <div style="margin-bottom: 24px;">
                <div style="margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">👤 Full Name</span>
                  <span style="font-size: 15px; color: #ffffff; font-weight: 600;">${name}</span>
                </div>
                <div style="margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">📧 Email Address</span>
                  <span style="font-size: 15px; color: #ffffff; font-weight: 600;"><a href="mailto:${email}" style="color: #c084fc; text-decoration: none;">${email}</a></span>
                </div>
                <div style="margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">🏢 Company / Organization</span>
                  <span style="font-size: 15px; color: #e2e8f0; font-weight: 500;">${company || "—"}</span>
                </div>
                <div style="margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">📝 Subject</span>
                  <span style="font-size: 15px; color: #e2e8f0; font-weight: 500;">${subject}</span>
                </div>
                <div style="margin-bottom: 14px;">
                  <span style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">💬 Message</span>
                  <div style="padding: 16px; background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin-bottom: 24px;"></div>
              
              <div style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
                <strong style="color: #e2e8f0;">📅 Submitted On:</strong> ${timestamp}
              </div>
              <div style="font-size: 13px; color: #94a3b8; margin-bottom: 24px;">
                <strong style="color: #e2e8f0;">🌐 Source:</strong> Portfolio Contact Page
              </div>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a5b4fc; font-weight: 500;">Please respond to this inquiry at your earliest convenience.</p>
              
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">Best Regards,</p>
              <p style="margin: 2px 0 24px 0; font-size: 14px; color: #ffffff; font-weight: 600;">Portfolio Contact System</p>
              
              <!-- Signature Line -->
              <div style="border-top: 1px dashed rgba(255, 255, 255, 0.1); padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
                <strong style="color: #e2e8f0; display: block; margin-bottom: 4px;">Mahammad Aftab Portfolio</strong>
                AI Engineer | Generative AI Specialist | Full-Stack Developer
              </div>
            </div>
          </div>
        `;

        // Render Visitor Confirmation Email (Sent to Visitor)
        const visitorHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; background-color: #0b071e; color: #f4f4f5;">
            <!-- Header Success Banner -->
            <div style="padding: 36px 24px; background: linear-gradient(135deg, #1e1b4b, #2e1065); border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <div style="width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; color: #10b981; font-size: 20px; text-align: center; margin: 0 auto 16px auto; font-weight: bold;">✓</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">Transmission Received</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #a78bfa; font-weight: 600;">Thank You for Contacting Mahammad Aftab 🚀</p>
            </div>
            
            <!-- Content Body -->
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #ffffff; font-weight: 600;">Hello ${name},</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #e2e8f0; line-height: 1.6;">Thank you for visiting the Mahammad Aftab Portfolio and reaching out.</p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #e2e8f0; line-height: 1.6;">Your message has been successfully received and I appreciate your interest.</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #e2e8f0; line-height: 1.6;">I will review your inquiry and get back to you as soon as possible.</p>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin-bottom: 24px;"></div>
              
              <!-- Submitted Information Card -->
              <h3 style="margin: 0 0 14px 0; font-size: 13px; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Your Submitted Information</h3>
              <div style="background-color: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <div style="margin-bottom: 10px;">
                  <strong style="font-size: 12px; color: #94a3b8; width: 80px; display: inline-block; vertical-align: top;">👤 Name:</strong>
                  <span style="font-size: 14px; color: #ffffff; font-weight: 600; display: inline-block;">${name}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <strong style="font-size: 12px; color: #94a3b8; width: 80px; display: inline-block; vertical-align: top;">📧 Email:</strong>
                  <span style="font-size: 14px; color: #ffffff; display: inline-block;">${email}</span>
                </div>
                <div style="margin-bottom: 10px;">
                  <strong style="font-size: 12px; color: #94a3b8; width: 80px; display: inline-block; vertical-align: top;">📝 Subject:</strong>
                  <span style="font-size: 14px; color: #ffffff; display: inline-block;">${subject}</span>
                </div>
                <div style="margin-bottom: 0;">
                  <strong style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 6px;">💬 Message:</strong>
                  <div style="font-size: 13px; color: #e2e8f0; line-height: 1.5; padding: 12px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; white-space: pre-wrap;">${message}</div>
                </div>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin-bottom: 24px;"></div>
              
              <!-- Social Links Section -->
              <h3 style="margin: 0 0 12px 0; font-size: 13px; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Connect With Me</h3>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">Meanwhile, feel free to connect with me through the following platforms:</p>
              
              <div style="margin-bottom: 28px;">
                <a href="https://www.linkedin.com/in/mahammad-aftab" target="_blank" style="padding: 10px 18px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block; margin-right: 8px; margin-bottom: 8px;">💼 LinkedIn</a>
                <a href="https://github.com/mahammadaftab" target="_blank" style="padding: 10px 18px; background-color: #1b1f23; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block; margin-right: 8px; margin-bottom: 8px;">🔗 GitHub</a>
                <a href="https://mahammadaftab.me" target="_blank" style="padding: 10px 18px; background: linear-gradient(to right, #4f46e5, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block; margin-right: 8px; margin-bottom: 8px;">🌐 Portfolio Website</a>
                <a href="mailto:mdaftabeditz360@gmail.com" style="padding: 10px 18px; background-color: #b91c1c; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block; margin-right: 8px; margin-bottom: 8px;">📧 Email</a>
              </div>
              
              <!-- Divider -->
              <div style="height: 1px; background: rgba(255, 255, 255, 0.08); margin-bottom: 24px;"></div>
              
              <!-- About Section -->
              <h3 style="margin: 0 0 12px 0; font-size: 13px; color: #c084fc; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">About Mahammad Aftab</h3>
              <div style="padding: 20px; background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; margin-bottom: 28px;">
                <ul style="margin: 0 0 12px 0; padding-left: 20px; font-size: 13px; color: #e2e8f0; line-height: 1.8; list-style-type: square;">
                  <li>🧠 AI Engineer</li>
                  <li>✨ Generative AI Specialist</li>
                  <li>💻 Full-Stack Software Engineer</li>
                  <li>☁️ Cloud & DevOps Enthusiast</li>
                </ul>
                <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6; font-style: italic;">
                  Focused on building intelligent AI systems, scalable software solutions, and innovative digital experiences.
                </p>
              </div>
              
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #e2e8f0;">Thank you once again for your message.</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #e2e8f0; font-weight: 600;">Looking forward to connecting with you.</p>
              
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">Best Regards,</p>
              <p style="margin: 2px 0 4px 0; font-size: 15px; color: #ffffff; font-weight: 700;">Mahammad Aftab</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #a78bfa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">AI Engineer & Software Developer</p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">📧 <a href="mailto:mdaftabeditz360@gmail.com" style="color: #818cf8; text-decoration: none;">mdaftabeditz360@gmail.com</a></p>
            </div>
          </div>
        `;

        // 1. Send Alert Email to Portfolio Owner
        try {
          const emailResult = await resend.emails.send({
            from: SENDER_EMAIL,
            to: CONTACT_EMAIL,
            subject: `🚀 New Portfolio Inquiry from ${name}`,
            text: `Hello Mahammad Aftab,\n\nYou have received a new inquiry through your portfolio website.\n\n👤 Full Name:\n${name}\n\n📧 Email Address:\n${email}\n\n🏢 Company / Organization:\n${company || "Not provided"}\n\n📝 Subject:\n${subject}\n\n💬 Message:\n\n${message}\n\n📅 Submitted On:\n${timestamp}\n\n🌐 Source:\nPortfolio Contact Page\n\nPlease respond to this inquiry at your earliest convenience.\n\nBest Regards,\nPortfolio Contact System`,
            html: ownerHtml,
            replyTo: email,
          });
          
          if (emailResult.error) {
            console.error("Owner alert email failed from Resend:", emailResult.error);
          } else {
            console.log("Owner alert email sent successfully:", emailResult.data);
          }
        } catch (ownerError) {
          console.error("Failed to send owner alert email:", ownerError);
        }

        // 2. Send Confirmation Email to Visitor
        try {
          const confirmResult = await resend.emails.send({
            from: SENDER_EMAIL,
            to: email, // Sent directly to the visitor's email entered in the form
            subject: `Thank You for Contacting Mahammad Aftab 🚀`,
            text: `Hello ${name},\n\nThank you for visiting the Mahammad Aftab Portfolio and reaching out.\n\nYour message has been successfully received and I appreciate your interest.\n\nI will review your inquiry and get back to you as soon as possible.\n\nBest Regards,\nMahammad Aftab\nAI Engineer & Software Developer\nmdaftabeditz360@gmail.com`,
            html: visitorHtml,
            replyTo: CONTACT_EMAIL,
          });
          
          if (confirmResult.error) {
            console.warn("Visitor confirmation email failed from Resend:", confirmResult.error);
          } else {
            console.log(`Visitor confirmation email sent successfully to ${email}:`, confirmResult.data);
          }
        } catch (visitorError) {
          console.warn("Failed to send visitor confirmation email:", visitorError);
        }
      } catch (emailError: any) {
        console.error("General Resend email operations failure:", emailError);
      }
    } else {
      // Log to console as fallback for local dev
      console.log("Contact form submission (no Resend API key set) - Dual-Email Simulated logs:");
      console.log("-> Alert Owner [mdaftabeditz360@gmail.com] of inquiry from:", name);
      console.log("-> Confirm to Visitor [", email, "] of receipt.");
      console.log("Details:", { name, email, company, subject, message });
    }
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact form error:", error);
    
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