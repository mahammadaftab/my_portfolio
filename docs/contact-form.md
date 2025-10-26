# Contact Form Implementation Guide

This guide provides detailed instructions for implementing and configuring the contact form backend functionality.

## Table of Contents

1. [Overview](#overview)
2. [API Route Implementation](#api-route-implementation)
3. [Email Service Integration](#email-service-integration)
4. [Form Validation](#form-validation)
5. [Spam Protection](#spam-protection)
6. [Rate Limiting](#rate-limiting)
7. [Analytics Tracking](#analytics-tracking)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Overview

The contact form uses a serverless function approach with Next.js API routes to handle form submissions. The implementation includes:

- Client-side form validation with Zod
- Server-side validation and sanitization
- Email delivery via third-party services
- Spam protection mechanisms
- Rate limiting to prevent abuse
- Analytics tracking for submissions

## API Route Implementation

The contact form API route is located at `src/app/api/contact/route.ts`.

### Basic Implementation

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Process the form submission
    // Send email, save to database, etc.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

## Email Service Integration

### Resend Integration (Recommended)

Resend is a modern email API that's easy to integrate.

1. Install the Resend package:
```bash
npm install resend
```

2. Update the API route:
```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL || "contact@yourdomain.com",
      to: process.env.CONTACT_EMAIL || "contact@yourdomain.com",
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      replyTo: email,
    });
    
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

### SendGrid Integration

1. Install the SendGrid package:
```bash
npm install @sendgrid/mail
```

2. Update the API route:
```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const msg = {
      to: process.env.SENDGRID_FROM_EMAIL || "contact@yourdomain.com",
      from: process.env.SENDGRID_FROM_EMAIL || "contact@yourdomain.com",
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      replyTo: email,
    };
    
    await sgMail.send(msg);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendGrid error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

### EmailJS Integration

1. Install the EmailJS package:
```bash
npm install @emailjs/browser
```

2. Update the API route:
```typescript
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import emailjs from "@emailjs/browser";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const templateParams = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
    };
    
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID || "",
      process.env.EMAILJS_TEMPLATE_ID || "",
      templateParams,
      process.env.EMAILJS_PUBLIC_KEY || ""
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("EmailJS error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

## Form Validation

### Client-Side Validation

The contact form uses Zod for client-side validation:

```typescript
// src/app/contact/page.tsx
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;
```

### Server-Side Validation

Additional validation should be performed on the server:

```typescript
// src/app/api/contact/route.ts
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = contactSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = validatedData.data;
    
    // Process the validated data
    // ...
  } catch (error) {
    // Error handling
  }
}
```

## Spam Protection

### Honeypot Field

Add a hidden field to detect bots:

```typescript
// src/app/contact/page.tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* Visible fields */}
  <div className="hidden">
    <label htmlFor="honeypot">Don't fill this out if you're human</label>
    <input
      id="honeypot"
      {...register("honeypot")}
      tabIndex={-1}
      autoComplete="off"
    />
  </div>
  
  {/* Other form fields */}
</form>
```

Server-side check:
```typescript
// src/app/api/contact/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, honeypot } = body;
    
    // Check honeypot
    if (honeypot) {
      return NextResponse.json({ success: true }); // Pretend success but don't send
    }
    
    // Continue with normal processing
  } catch (error) {
    // Error handling
  }
}
```

### reCAPTCHA Integration

1. Add reCAPTCHA to the form:
```typescript
// src/app/contact/page.tsx
'use client';

import { useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

export default function Contact() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const onSubmit = async (data: ContactFormData) => {
    // Get reCAPTCHA token
    const token = await recaptchaRef.current?.executeAsync();
    
    // Include token in API request
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...data, token })
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      />
      
      <button type="submit">Send Message</button>
    </form>
  );
}
```

2. Verify reCAPTCHA on the server:
```typescript
// src/app/api/contact/route.ts
async function verifyRecaptcha(token: string) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    { method: "POST" }
  );
  
  const data = await response.json();
  return data.success && data.score >= 0.5;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, token } = body;
    
    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(token);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Failed spam check" },
        { status: 400 }
      );
    }
    
    // Continue with normal processing
  } catch (error) {
    // Error handling
  }
}
```

## Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// src/app/api/contact/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter for contact form
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
  analytics: true,
});

export async function POST(request: Request) {
  // Get IP address
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  // Check rate limit
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  
  // Continue with normal processing
  try {
    // ...
  } catch (error) {
    // Error handling
  }
}
```

## Analytics Tracking

Track form submissions for analytics:

```typescript
// src/app/contact/page.tsx
const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  setSubmitError("");
  
  try {
    // Track form submission attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_submit', {
        event_category: 'engagement',
        event_label: 'Contact Form Submission Attempt'
      });
    }
    
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      setSubmitSuccess(true);
      reset();
      
      // Track successful submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_form_success', {
          event_category: 'engagement',
          event_label: 'Contact Form Submitted Successfully'
        });
      }
    } else {
      setSubmitError("Failed to send message. Please try again.");
    }
  } catch (error) {
    setSubmitError("An error occurred. Please try again.");
    
    // Track error
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_error', {
        event_category: 'engagement',
        event_label: 'Contact Form Submission Error'
      });
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

## Error Handling

Implement comprehensive error handling:

```typescript
// src/app/api/contact/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Process the form submission
    // ...
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Log error for debugging
    console.error("Contact form error:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return user-friendly error message
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
```

## Testing

### Unit Tests

Test the API route:
```typescript
// src/app/api/contact/route.test.ts
import { POST } from './route';

describe('Contact API', () => {
  it('should return error for missing fields', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
  });
  
  it('should return success for valid data', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

### Integration Tests

Test the complete form flow:
```typescript
// src/app/contact/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './page';

describe('Contact Page', () => {
  it('should display validation errors for empty form', async () => {
    render(<Contact />);
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });
  
  it('should submit form with valid data', async () => {
    render(<Contact />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Test Subject' }
    });
    
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'This is a test message' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(await screen.findByText(/your message has been sent successfully/i)).toBeInTheDocument();
  });
});
```

## Deployment

### Environment Variables

Set the following environment variables in your deployment platform:

```env
# For Resend
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_contact_email

# For SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_from_email

# For EmailJS
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key

# For reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# For Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# For Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Vercel Deployment

1. Set environment variables in Vercel dashboard
2. Deploy the application
3. Test the contact form

### Netlify Deployment

1. Set environment variables in Netlify dashboard
2. Deploy the application
3. Test the contact form

### Render Deployment

1. Set environment variables in Render dashboard
2. Deploy the application
3. Test the contact form

## Best Practices

1. **Always validate input** on both client and server
2. **Use environment variables** for sensitive information
3. **Implement rate limiting** to prevent abuse
4. **Add spam protection** mechanisms
5. **Log errors** for debugging but don't expose sensitive information
6. **Test thoroughly** before deployment
7. **Monitor submissions** for unusual activity
8. **Keep dependencies updated** for security

## Troubleshooting

### Common Issues

1. **Emails not sending**: Check API keys and environment variables
2. **Validation errors**: Ensure client and server validation match
3. **Rate limiting**: Check Upstash Redis configuration
4. **reCAPTCHA not working**: Verify site and secret keys
5. **CORS errors**: Ensure proper headers in API responses

### Debugging Tips

1. **Check server logs** for error messages
2. **Test API endpoint directly** with tools like Postman
3. **Verify environment variables** are set correctly
4. **Use console.log** for debugging in development
5. **Check browser developer tools** for network errors

## Security Considerations

1. **Never expose API keys** in client-side code
2. **Validate all input** to prevent injection attacks
3. **Implement proper rate limiting** to prevent abuse
4. **Use HTTPS** for all communications
5. **Sanitize user input** before processing
6. **Keep dependencies updated** for security patches
7. **Implement proper error handling** without exposing sensitive information