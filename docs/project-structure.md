# Project Structure Documentation

## Overview

This document provides a comprehensive overview of the portfolio website's architecture, components, and implementation details.

## Directory Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── docs/                       # Project documentation
├── public/                     # Static assets
│   ├── images/                 # Image assets
│   ├── favicon.ico             # Favicon
│   └── ...                     # Other static files
├── src/
│   ├── app/                    # Next.js App Router structure
│   │   ├── about/
│   │   │   └── page.tsx        # About page
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts    # Contact form API endpoint
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact page
│   │   ├── experience/
│   │   │   └── page.tsx        # Experience & certificates page
│   │   ├── projects/
│   │   │   └── page.tsx        # Projects page
│   │   ├── resume/
│   │   │   └── page.tsx        # Resume page
│   │   ├── skills/
│   │   │   └── page.tsx        # Skills page
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── not-found.tsx       # 404 page
│   │   ├── sitemap.ts          # Sitemap generator
│   │   └── robots.ts           # Robots.txt configuration
│   ├── components/             # Reusable components
│   │   ├── custom-cursor.tsx   # Custom cursor implementation
│   │   ├── footer.tsx          # Footer component
│   │   ├── navbar.tsx          # Navigation bar
│   │   ├── scroll-progress.tsx # Scroll progress indicator
│   │   ├── theme-provider.tsx  # Theme provider wrapper
│   │   └── three-scene.tsx     # 3D scene component
│   ├── data/                   # JSON data files
│   │   ├── projects.json       # Projects data
│   │   └── experience.json     # Experience & certificates data
│   └── lib/                    # Utility functions and helpers
├── styles/                     # Global styles
├── .eslintrc.json              # ESLint configuration
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Project README
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## Component Architecture

### Layout Components

1. **Root Layout** ([src/app/layout.tsx](src/app/layout.tsx))
   - Wraps all pages with providers
   - Includes global components (navbar, footer, custom cursor)
   - Sets metadata and SEO tags

2. **Navbar** ([src/components/navbar.tsx](src/components/navbar.tsx))
   - Responsive navigation with mobile menu
   - Dark/light mode toggle
   - Active link highlighting

3. **Footer** ([src/components/footer.tsx](src/components/footer.tsx))
   - Site-wide footer with navigation links
   - Social media connections
   - Copyright information

### Global Components

1. **Theme Provider** ([src/components/theme-provider.tsx](src/components/theme-provider.tsx))
   - Wrapper for next-themes library
   - Manages dark/light mode state

2. **Custom Cursor** ([src/components/custom-cursor.tsx](src/components/custom-cursor.tsx))
   - Interactive custom cursor with hover effects
   - Disables on touch devices

3. **Scroll Progress** ([src/components/scroll-progress.tsx](src/components/scroll-progress.tsx))
   - Visual indicator of scroll progress
   - Full-width progress bar at top of page

### Page Components

1. **Home Page** ([src/app/page.tsx](src/app/page.tsx))
   - Hero section with 3D animation
   - Typing text animation
   - Call-to-action buttons

2. **About Page** ([src/app/about/page.tsx](src/app/about/page.tsx))
   - Personal introduction
   - Professional timeline
   - Key metrics and achievements

3. **Skills Page** ([src/app/skills/page.tsx](src/app/skills/page.tsx))
   - Skill categories with filtering
   - Progress bars for skill levels
   - Technology stack showcase

4. **Projects Page** ([src/app/projects/page.tsx](src/app/projects/page.tsx))
   - Project grid with filtering
   - Project cards with tags
   - Links to live demos and source code

5. **Experience Page** ([src/app/experience/page.tsx](src/app/experience/page.tsx))
   - Professional timeline
   - Certificate showcase
   - Detailed role descriptions

6. **Resume Page** ([src/app/resume/page.tsx](src/app/resume/page.tsx))
   - Resume preview
   - Download functionality
   - Professional summary

7. **Contact Page** ([src/app/contact/page.tsx](src/app/contact/page.tsx))
   - Contact form with validation
   - Contact information
   - Social media links

### Utility Components

1. **3D Scene** ([src/components/three-scene.tsx](src/components/three-scene.tsx))
   - React Three Fiber implementation
   - Animated sphere with distortion effect

## Data Management

### JSON Data Files

1. **Projects Data** ([src/data/projects.json](src/data/projects.json))
   - Project title, description, and tags
   - Live demo and GitHub links
   - Image paths

2. **Experience Data** ([src/data/experience.json](src/data/experience.json))
   - Work experience timeline
   - Certificate information
   - Role responsibilities

## Styling System

### Tailwind CSS

The project uses Tailwind CSS for styling with the following customizations:

1. **Custom Colors**: Extended color palette in [tailwind.config.js](tailwind.config.js)
2. **Dark Mode**: Class-based dark mode implementation
3. **Responsive Design**: Mobile-first responsive utilities
4. **Custom Utilities**: Additional utility classes in [src/app/globals.css](src/app/globals.css)

### Animations

1. **Framer Motion**: Page transitions and micro-interactions
2. **Lottie**: Micro-animations for UI elements
3. **CSS Animations**: Custom keyframe animations

## Performance Optimizations

1. **Code Splitting**: Next.js automatic code splitting
2. **Image Optimization**: Next/Image component
3. **Font Optimization**: next/font for Google Fonts
4. **Bundle Analysis**: Webpack Bundle Analyzer integration
5. **Lazy Loading**: Component and image lazy loading

## Accessibility Features

1. **Semantic HTML**: Proper HTML5 semantic elements
2. **ARIA Attributes**: Accessible Rich Internet Applications
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Management**: Visible focus indicators
5. **Screen Reader Support**: Proper labeling and structure

## SEO Implementation

1. **Meta Tags**: Dynamic meta tags per page
2. **Open Graph**: Social media sharing optimization
3. **Sitemap**: Automatically generated sitemap
4. **Robots.txt**: Search engine crawling rules
5. **Structured Data**: JSON-LD implementation

## Testing Strategy

1. **Unit Tests**: Jest for component testing
2. **Integration Tests**: Testing Library for user interactions
3. **End-to-End Tests**: Cypress for full user flows
4. **Visual Regression**: Storybook for UI component testing

## Deployment

### Vercel Deployment

1. **Automatic Deployments**: GitHub integration
2. **Preview Deployments**: Pull request previews
3. **Environment Variables**: Secure secret management
4. **Custom Domains**: Domain configuration

### Serverless Functions

1. **API Routes**: Next.js API routes for backend functionality
2. **Contact Form**: Serverless function for email handling
3. **Rate Limiting**: Protection against spam submissions

## Security Considerations

1. **Content Security Policy**: CSP headers configuration
2. **Form Validation**: Client and server-side validation
3. **Rate Limiting**: API endpoint protection
4. **Dependency Auditing**: Regular security audits

## Maintenance

1. **Dependency Updates**: Automated update workflows
2. **Performance Monitoring**: Lighthouse CI integration
3. **Error Tracking**: Sentry or similar error reporting
4. **Analytics**: Privacy-focused analytics implementation