# Deployment Guide

This guide provides detailed instructions for deploying the portfolio website to various platforms, including Vercel, Netlify, and Render, with best practices for production deployment.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [Render Deployment](#render-deployment)
6. [Environment Variables](#environment-variables)
7. [Domain Configuration](#domain-configuration)
8. [CI/CD Setup](#cicd-setup)
9. [Performance Optimization](#performance-optimization)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Backup and Recovery](#backup-and-recovery)
12. [Security Considerations](#security-considerations)
13. [Troubleshooting](#troubleshooting)
14. [Best Practices](#best-practices)

## Overview

The portfolio website can be deployed to multiple platforms with minimal configuration. This guide covers:

- **Vercel Deployment**: Recommended for Next.js applications
- **Netlify Deployment**: Alternative static site hosting
- **Render Deployment**: Full-stack application hosting
- **Environment Configuration**: Managing secrets and configuration
- **Domain Setup**: Custom domain configuration
- **CI/CD Integration**: Automated deployment pipelines
- **Performance Tuning**: Optimization for production
- **Monitoring**: Tracking application health and performance

## Prerequisites

### System Requirements

1. **Node.js**: Version 18.x or later
2. **npm**: Version 8.x or later (or yarn/pnpm)
3. **Git**: For version control and deployment
4. **Account**: Platform accounts (Vercel, Netlify, or Render)

### Project Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Build the project
npm run build
```

### Required Files

Ensure the following files exist in your project root:

```
portfolio/
├── package.json
├── next.config.js
├── .env.local (for local development)
├── .gitignore
├── vercel.json (if using Vercel)
└── netlify.toml (if using Netlify)
```

## Vercel Deployment

### Why Vercel?

Vercel is the recommended deployment platform for Next.js applications because:

- **Zero Configuration**: Automatic Next.js optimization
- **Global CDN**: Fast worldwide content delivery
- **Serverless Functions**: Built-in API route support
- **Automatic HTTPS**: Free SSL certificates
- **Git Integration**: Automatic deployments from GitHub
- **Preview Deployments**: Pull request previews
- **Edge Network**: Global edge computing

### Deployment Methods

#### 1. Deploy from Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in or create an account
3. Click "New Project"
4. Import your Git repository (GitHub, GitLab, or Bitbucket)
5. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave empty (or specify if in subdirectory)
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

#### 2. Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
vercel

# Deploy to production
vercel --prod
```

#### 3. Deploy with GitHub Actions

```yaml
# .github/workflows/deploy-vercel.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Vercel Configuration

#### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "includeFiles": [
          "next.config.js",
          "public/**/*",
          "src/**/*"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add your environment variables:

```bash
# Required for contact form
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_contact_email

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Security
NEXT_PUBLIC_SITE_URL=https://your-portfolio.com
```

## Netlify Deployment

### Why Netlify?

Netlify is an excellent alternative for static site deployment:

- **Easy Setup**: Simple drag-and-drop deployment
- **Free Tier**: Generous free tier with custom domains
- **Form Handling**: Built-in form submission handling
- **Function Support**: Serverless functions
- **A/B Testing**: Built-in split testing
- **Redirects**: Powerful redirect and rewrite rules

### Deployment Methods

#### 1. Deploy from Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Sign in or create an account
3. Click "New site from Git"
4. Connect to your Git provider
5. Select your repository
6. Configure build settings:
   - Build command: `next build && next export`
   - Publish directory: `out`

#### 2. Deploy with Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy site
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration

#### netlify.toml

```toml
[build]
  command = "next build"
  publish = ".next/standalone"
  functions = "out_functions"

[build.environment]
  NODE_VERSION = "18"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  node_bundler = "esbuild"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add your environment variables:

```bash
# Required for contact form
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_contact_email

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Build settings
NEXT_TELEMETRY_DISABLED=1
```

## Render Deployment

### Why Render?

Render is a unified cloud platform that's great for:

- **Full-Stack Applications**: Host frontend, backend, and databases
- **Simple Pricing**: Predictable pricing model
- **Automatic SSL**: Free SSL certificates
- **Custom Domains**: Easy domain configuration
- **Cron Jobs**: Scheduled tasks
- **Private Services**: Internal services

### Deployment as Web Service

#### 1. Create Render Blueprint

```yaml
# render.yaml
services:
  - type: web
    name: portfolio
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_TELEMETRY_DISABLED
        value: 1
    domains:
      - your-portfolio.onrender.com
```

#### 2. Deploy from Render Dashboard

1. Go to [render.com](https://render.com)
2. Sign in or create an account
3. Click "New Web Service"
4. Connect your Git repository
5. Configure service settings:
   - Name: Your service name
   - Runtime: Node
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Root directory: Leave empty

### Environment Variables in Render

1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Add your environment variables:

```bash
# Required for contact form
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_contact_email

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Build settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Environment Variables

### Required Environment Variables

```bash
# Contact form configuration
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=contact@your-portfolio.com

# Analytics (Google Analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site configuration
NEXT_PUBLIC_SITE_URL=https://your-portfolio.com

# Security settings
NEXT_TELEMETRY_DISABLED=1
```

### Local Development

Create a `.env.local` file in your project root:

```bash
# .env.local
RESEND_API_KEY=your_test_api_key
CONTACT_EMAIL=test@your-portfolio.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=
```

### Production Environment Variables

#### Vercel

```bash
# Set in Vercel dashboard
vercel env add RESEND_API_KEY production
vercel env add CONTACT_EMAIL production
vercel env add NEXT_PUBLIC_GA_ID production
```

#### Netlify

```bash
# Set in Netlify dashboard
netlify env:set RESEND_API_KEY your_api_key
netlify env:set CONTACT_EMAIL contact@your-portfolio.com
netlify env:set NEXT_PUBLIC_GA_ID G-XXXXXXXXXX
```

#### Render

```bash
# Set in Render dashboard
# Environment variables are configured in the web interface
```

## Domain Configuration

### Custom Domain Setup

#### Vercel Domain Configuration

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Verify domain ownership

#### Netlify Domain Configuration

1. Go to your Netlify site dashboard
2. Navigate to "Domain management"
3. Add custom domain
4. Update DNS records as instructed
5. Enable HTTPS (automatic)

#### Render Domain Configuration

1. Go to your Render service dashboard
2. Navigate to "Settings" > "Custom Domains"
3. Add your domain
4. Configure DNS records

### DNS Configuration

#### A Record Configuration

```
Type: A
Name: @ (or your subdomain)
Value: 76.76.21.21 (Vercel IP)
TTL: Auto
```

#### CNAME Record Configuration

```
Type: CNAME
Name: www (or your subdomain)
Value: cname.vercel-dns.com (Vercel)
TTL: Auto
```

### SSL Certificate

All platforms provide free SSL certificates:

- **Vercel**: Automatic HTTPS with Let's Encrypt
- **Netlify**: Automatic SSL certificate provisioning
- **Render**: Free SSL certificates for custom domains

## CI/CD Setup

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests
        run: npm run test
        
      - name: Run security audit
        run: npm audit --audit-level=moderate

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build project
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-output
          path: .next/

  deploy-vercel:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-netlify:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './out'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Preview Deployments

```yaml
# Preview deployments for pull requests
preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Deploy preview
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        vercel-args: '--prebuilt'
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      'lottie-react'
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  }
};

module.exports = nextConfig;
```

### Caching Strategy

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Compression

```javascript
// next.config.js
const CompressionPlugin = require('compression-webpack-plugin');

const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new CompressionPlugin({
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            level: 11,
          },
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    return config;
  }
};

module.exports = nextConfig;
```

## Monitoring and Analytics

### Google Analytics Setup

```typescript
// src/lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  (window as any).gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: any) => {
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### Error Tracking

```typescript
// src/lib/error-tracking.ts
export function initErrorTracking() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Initialize Sentry or other error tracking service
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
      });
    });
  }
}
```

### Performance Monitoring

```typescript
// src/lib/performance-monitoring.ts
export function reportWebVitals() {
  if ('serviceWorker' in navigator) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}
```

## Backup and Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

# Create backup directory
mkdir -p backups/$(date +%Y-%m-%d)

# Backup source code
git bundle create backups/$(date +%Y-%m-%d)/source.bundle --all

# Backup environment variables (encrypted)
gpg --symmetric --cipher-algo AES256 .env.production

# Prune old backups (keep last 30 days)
find backups/ -name "*.bundle" -mtime +30 -delete
find backups/ -name "*.gpg" -mtime +30 -delete
```

### Disaster Recovery Plan

```markdown
# Disaster Recovery Plan

## 1. Immediate Response
- Identify the issue and assess impact
- Notify stakeholders
- Activate backup systems if available

## 2. Investigation
- Review logs and error reports
- Identify root cause
- Document findings

## 3. Resolution
- Implement fix or workaround
- Test solution thoroughly
- Deploy to production

## 4. Post-Mortem
- Document incident and resolution
- Update procedures to prevent recurrence
- Communicate lessons learned
```

## Security Considerations

### Security Headers

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.google-analytics.com;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

### Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

```bash
# Check build logs
vercel logs your-portfolio.vercel.app

# Local build test
npm run build

#