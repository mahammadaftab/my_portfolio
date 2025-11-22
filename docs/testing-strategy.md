# Testing Strategy Documentation

This guide provides a comprehensive overview of the testing strategy implemented for the portfolio website, covering unit tests, integration tests, end-to-end tests, and other testing methodologies to ensure high quality and reliability.

## Table of Contents

1. [Overview](#overview)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Component Testing](#component-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Visual Regression Testing](#visual-regression-testing)
11. [API Testing](#api-testing)
12. [Cross-Browser Testing](#cross-browser-testing)
13. [Mobile Testing](#mobile-testing)
14. [Continuous Integration](#continuous-integration)
15. [Test Coverage](#test-coverage)
16. [Best Practices](#best-practices)
17. [Tools and Libraries](#tools-and-libraries)
18. [Troubleshooting](#troubleshooting)

## Overview

The portfolio website implements a comprehensive testing strategy that includes:

- **Unit Tests**: Testing individual functions and components in isolation
- **Integration Tests**: Testing interactions between components and modules
- **End-to-End Tests**: Testing complete user workflows
- **Component Tests**: Testing UI components in isolation
- **Accessibility Tests**: Ensuring WCAG compliance
- **Performance Tests**: Validating loading and runtime performance
- **Security Tests**: Identifying potential vulnerabilities
- **Visual Regression Tests**: Catching unintended visual changes
- **API Tests**: Validating backend functionality
- **Cross-Browser Tests**: Ensuring compatibility across browsers

## Testing Pyramid

### Test Distribution

```
        ┌─────────────────┐
        │  E2E Tests      │  ← 10-15%
        │  (Cypress)      │
        └─────────────────┘
               │
        ┌─────────────────┐
        │ Integration     │  ← 20-30%
        │ Tests (Jest)    │
        └─────────────────┘
               │
        ┌─────────────────┐
        │   Unit Tests    │  ← 60-70%
        │  (Jest/RTL)     │
        └─────────────────┘
```

### Testing Principles

1. **Write tests for critical user flows**
2. **Focus on edge cases and error conditions**
3. **Maintain test independence**
4. **Keep tests fast and reliable**
5. **Use realistic test data**
6. **Mock external dependencies**
7. **Automate testing in CI/CD**

## Unit Testing

### Setup and Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
```

### Testing Utilities

```typescript
// src/test-utils.ts
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactElement } from 'react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Unit Test Examples

```typescript
// src/components/button.test.tsx
import { render, screen, fireEvent } from '@/test-utils';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

```typescript
// src/lib/utils.test.ts
import { formatCurrency, validateEmail } from './utils';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000.5)).toBe('$1,001.00');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('validateEmail', () => {
  it('returns true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('returns false for invalid emails', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });
});
```

## Integration Testing

### Component Integration Tests

```typescript
// src/components/contact-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@/test-utils';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<ContactForm onSubmit={mockSubmit} />);
    
    // Fill out form
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
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      });
    });
  });

  it('shows validation errors for empty form', async () => {
    render(<ContactForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### API Integration Tests

```typescript
// src/app/api/contact/route.test.ts
import { POST } from './route';
import { Ratelimit } from '@upstash/ratelimit';

// Mock rate limiting
jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: jest.fn(),
    fromEnv: jest.fn().mockReturnValue({
      limit: jest.fn().mockResolvedValue({ success: true })
    })
  }
}));

describe('Contact API', () => {
  it('returns success for valid data', async () => {
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
  
  it('returns error for invalid data', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Invalid: empty name
        email: 'invalid-email',
        subject: '',
        message: ''
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid input data');
  });
  
  it('returns rate limit error when limit exceeded', async () => {
    // Mock rate limiting to fail
    (Ratelimit.fromEnv as jest.Mock).mockReturnValue({
      limit: jest.fn().mockResolvedValue({ success: false })
    });
    
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(429);
    expect(data.error).toBe('Too many requests. Please try again later.');
  });
});
```

## End-to-End Testing

### Cypress Configuration

```javascript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0
    }
  },
  env: {
    NODE_ENV: 'test'
  }
});
```

### E2E Test Examples

```javascript
// cypress/e2e/navigation.cy.js
describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate between pages', () => {
    cy.get('[data-testid="navbar"]').should('be.visible');
    
    cy.get('[href="/projects"]').click();
    cy.url().should('include', '/projects');
    cy.get('h1').contains('My Projects');
    
    cy.get('[href="/contact"]').click();
    cy.url().should('include', '/contact');
    cy.get('h1').contains('Get In Touch');
  });

  it('should have working mobile menu', () => {
    cy.viewport('iphone-6');
    
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
    
    cy.get('[href="/about"]').click();
    cy.url().should('include', '/about');
  });
});
```

```javascript
// cypress/e2e/contact-form.cy.js
describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('should submit form with valid data', () => {
    cy.get('[data-testid="name-input"]').type('John Doe');
    cy.get('[data-testid="email-input"]').type('john@example.com');
    cy.get('[data-testid="subject-input"]').type('Test Subject');
    cy.get('[data-testid="message-input"]').type('This is a test message');
    
    cy.get('[data-testid="submit-button"]').click();
    
    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Your message has been sent successfully');
  });

  it('should show validation errors for empty form', () => {
    cy.get('[data-testid="submit-button"]').click();
    
    cy.get('[data-testid="name-error"]').should('be.visible');
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="subject-error"]').should('be.visible');
    cy.get('[data-testid="message-error"]').should('be.visible');
  });
});
```

## Component Testing

### Storybook Configuration

```javascript
// .storybook/main.js
module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
```

### Component Stories

```typescript
// src/components/button.stories.tsx
import { Button } from './button';
import { Story, Meta } from '@storybook/react';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    }
  }
} as Meta;

const Template: Story<any> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Large Button',
};
```

### Visual Testing with Storybook

```javascript
// .storybook/preview.js
import { themes } from '@storybook/theming';
import { withTests } from '@storybook/addon-jest';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    element: '#root',
    manual: false,
  },
  docs: {
    theme: themes.dark,
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1a202c' },
    ],
  },
};
```

## Accessibility Testing

### Automated Accessibility Tests

```typescript
// src/components/navbar.test.tsx
import { render } from '@/test-utils';
import { axe } from 'jest-axe';
import { Navbar } from './navbar';

describe('Navbar', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper landmark roles', () => {
    const { getByRole } = render(<Navbar />);
    expect(getByRole('navigation')).toBeInTheDocument();
  });

  it('should have accessible navigation links', () => {
    const { getAllByRole } = render(<Navbar />);
    const links = getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-label');
    });
  });
});
```

### Manual Accessibility Testing

```markdown
## Manual Accessibility Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order follows logical sequence
- [ ] Visible focus indicators on all focusable elements
- [ ] Keyboard traps are properly implemented
- [ ] Skip links work correctly

### Screen Reader Testing
- [ ] Content is read in logical order
- [ ] All images have appropriate alt text
- [ ] Form labels are properly associated
- [ ] Landmark regions are announced
- [ ] Dynamic content updates are announced

### Visual Testing
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Text is readable without zooming
- [ ] Content remains visible when fonts are enlarged
- [ ] No information is conveyed by color alone
- [ ] Focus indicators are clearly visible

### Mobile Testing
- [ ] Touch targets are appropriately sized (44px minimum)
- [ ] Content is readable on small screens
- [ ] Orientation changes don't break functionality
- [ ] Voice control works with interactive elements
```

## Performance Testing

### Lighthouse Integration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }]
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Web Vitals Testing

```typescript
// src/lib/web-vitals.test.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

describe('Web Vitals', () => {
  it('should measure core web vitals', () => {
    const mockReport = jest.fn();
    
    getCLS(mockReport);
    getFID(mockReport);
    getFCP(mockReport);
    getLCP(mockReport);
    getTTFB(mockReport);
    
    // In a real test, you would mock the PerformanceObserver API
    // and verify that the metrics are reported correctly
  });
});
```

### Bundle Size Testing

```javascript
// jest.bundle-size.js
const fs = require('fs');
const path = require('path');

describe('Bundle Size', () => {
  it('should not exceed size limits', () => {
    const mainBundlePath = path.join(__dirname, '.next/static/chunks/main-*.js');
    const mainBundleFiles = fs.readdirSync(path.dirname(mainBundlePath))
      .filter(file => file.startsWith('main-') && file.endsWith('.js'));
    
    if (mainBundleFiles.length > 0) {
      const mainBundle = fs.statSync(
        path.join(path.dirname(mainBundlePath), mainBundleFiles[0])
      );
      
      const maxSize = 200 * 1024; // 200KB
      expect(mainBundle.size).toBeLessThan(maxSize);
    }
  });
});
```

## Security Testing

### Security Test Examples

```typescript
// src/security.test.ts
import { sanitizeInput, validateUrl } from './lib/security';

describe('Security', () => {
  describe('Input Sanitization', () => {
    it('should remove XSS attack vectors', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('should allow safe HTML', () => {
      const safeInput = '<p>Hello <strong>world</strong></p>';
      const sanitized = sanitizeInput(safeInput);
      expect(sanitized).toContain('<p>');
      expect(sanitized).toContain('<strong>');
    });
  });

  describe('URL Validation', () => {
    it('should allow valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('javascript:alert(1)')).toBe(false);
      expect(validateUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    });
  });
});
```

### Dependency Security Testing

```json
// package.json scripts
{
  "scripts": {
    "test:security": "npm audit --audit-level=moderate && npm run test:security:deps",
    "test:security:deps": "npx audit-ci --moderate"
  }
}
```

## Visual Regression Testing

### Chromatic Integration

```javascript
// .storybook/main.js
module.exports = {
  // ... other configuration
  addons: [
    // ... other addons
    'storybook-chromatic',
  ],
};
```

```bash
# Run visual regression tests
npx chromatic --project-token=YOUR_PROJECT_TOKEN
```

### Percy Integration

```javascript
// cypress/support/e2e.js
import '@percy/cypress';

// cypress/e2e/visual-regression.cy.js
describe('Visual Regression', () => {
  it('should match homepage snapshot', () => {
    cy.visit('/');
    cy.percySnapshot('Homepage');
  });

  it('should match projects page snapshot', () => {
    cy.visit('/projects');
    cy.percySnapshot('Projects Page');
  });
});
```

## API Testing

### API Test Examples

```typescript
// src/app/api/contact/route.test.ts
import { POST } from './route';

describe('Contact API', () => {
  it('should return 405 for non-POST requests', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'GET'
    });
    
    // Assuming you have a GET handler that returns 405
    // This would require modifying the route to handle different methods
    const response = await POST(request);
    expect(response.status).toBe(405);
  });

  it('should handle CORS headers', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: {
        'Origin': 'https://example.com'
      }
    });
    
    const response = await POST(request);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should rate limit requests', async () => {
    // Mock rate limiting to simulate limit exceeded
    jest.mock('@/lib/rate-limit', () => ({
      checkRateLimit: jest.fn().mockResolvedValue(false)
    }));
    
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello'
      })
    });
    
    const response = await POST(request);
    expect(response.status).toBe(429);
  });
});
```

## Cross-Browser Testing

### Browser Testing Configuration

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Cross-Browser Test Examples

```typescript
// tests/cross-browser/navigation.test.ts
import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Projects');
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.locator('h1')).toContainText('My Projects');
    
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.locator('h1')).toContainText('Get In Touch');
  });

  test('should have responsive design', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that mobile menu is visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Check that desktop menu is hidden
    await expect(page.locator('[data-testid="desktop-menu"]')).toBeHidden();
  });
});
```

## Mobile Testing

### Mobile-Specific Tests

```typescript
// cypress/e2e/mobile.cy.js
describe('Mobile Testing', () => {
  beforeEach(() => {
    cy.viewport('iphone-6');
    cy.visit('/');
  });

  it('should show mobile menu on small screens', () => {
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="desktop-menu"]').should('not.be.visible');
  });

  it('should have appropriately sized touch targets', () => {
    cy.get('button').each(($button) => {
      cy.wrap($button).should('have.css', 'min-height', '44px');
      cy.wrap($button).should('have.css', 'min-width', '44px');
    });
  });

  it('should maintain readability on mobile', () => {
    cy.get('p').each(($p) => {
      cy.wrap($p).should('have.css', 'font-size').and('not.eq', '0px');
    });
  });
});
```

### Touch Interaction Testing

```typescript
// tests/touch-interactions.test.ts
import { test, expect } from '@playwright/test';

test.describe('Touch Interactions', () => {
  test.use({ hasTouch: true });

  test('should handle touch events', async ({ page }) => {
    await page.goto('/projects');
    
    // Simulate touch on a project card
    const projectCard = page.locator('.project-card').first();
    await projectCard.tap();
    
    // Verify navigation or modal opening
    await expect(page).toHaveURL(/.*projects/);
  });

  test('should handle swipe gestures', async ({ page }) => {
    await page.goto('/');
    
    // Simulate swipe gesture
    await page.touchscreen.swipe(100, 100, 200, 100);
    
    // Verify expected behavior
    // (This would depend on your specific swipe implementation)
  });
});
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:unit

    - name: Run integration tests
      run: npm run test:integration

    - name: Run security audit
      run: npm run test:security

    - name: Run accessibility tests
      run: npm run test:accessibility

  e2e:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Start development server
      run: npm run dev &
      env:
        NODE_ENV: test

    - name: Wait for server to start
      run: sleep 10

    - name: Run E2E tests
      run: npm run test:e2e

    - name: Run visual regression tests
      run: npm run test:visual

  deploy:
    needs: e2e
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
```

### Test Reporting

```json
// package.json
{
  "scripts": {
    "test": "jest --coverage",
    "test:unit": "jest src/**/*.test.ts src/**/*.test.tsx",
    "test:integration": "jest src/**/*integration.test.ts",
    "test:e2e": "cypress run",
    "test:visual": "npx chromatic --project-token=YOUR_TOKEN",
    "test:accessibility": "jest --testPathPattern=accessibility",
    "test:security": "npm audit --audit-level=moderate",
    "test:ci": "npm run test:unit && npm run test:integration && npm run test:security",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage && open coverage/lcov-report/index.html"
  }
}
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  // ... other configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/layout.tsx',
    '!src/app/**/page.tsx', // Page components are tested via E2E
    '!src/test-utils.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Coverage Analysis

```bash
# Generate coverage report
npm run test:coverage

# View detailed coverage report
open coverage/lcov-report/index.html

# Check coverage thresholds
npm run test -- --coverage --coverageThreshold='{"global":{"lines":80,"functions":80,"branches":80,"statements":80}}'
```

## Best Practices

### Test Organization

1. **Keep tests close to the code** they're testing
2. **Use descriptive test names** that explain the behavior
3. **Test one thing at a time** to make failures easier to debug
4. **Use beforeEach/afterEach** for setup and teardown
5. **Mock external dependencies** to isolate the code under test

### Test Data

1. **Use factories** for complex test data
2. **Keep test data minimal** and focused
3. **Use realistic data** that matches production scenarios
4. **Avoid shared state** between tests

### Test Maintenance

1. **Run tests regularly** during development
2. **Refactor tests** when refactoring code
3. **Remove obsolete tests** when removing features
4. **Update tests** when changing behavior

### Performance Optimization

1. **Use parallel test execution** when possible
2. **Mock expensive operations** in unit tests
3. **Use test databases** for integration tests
4. **Cache test results** in CI/CD pipelines

## Tools and Libraries

### Core Testing Libraries

1. **Jest**: JavaScript testing framework
2. **React Testing Library**: React component testing utilities
3. **Cypress**: End-to-end testing framework
4. **Playwright**: Cross-browser testing framework
5. **Storybook**: Component development and testing environment

### Additional Tools

1. **axe-core**: Accessibility testing
2. **Lighthouse**: Performance and SEO testing
3. **Chromatic**: Visual regression testing
4. **Percy**: Visual testing platform
5. **Jest-axe**: Jest accessibility assertions
6. **Mock Service Worker**: API mocking for tests

### Configuration Files

```json
// package.json devDependencies
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "cypress": "^12.9.0",
    "@playwright/test": "^1.32.0",
    "@storybook/react": "^7.0.0",
    "jest-axe": "^7.0.0",
    "chromatic": "^6.17.0",
    "@percy/cypress": "^3.1.2",
    "audit-ci": "^6.6.1"
  }
}
```

## Troubleshooting

### Common Issues

1. **Tests failing due to async operations**: Use `async/await` or `act()` wrapper
2. **Missing DOM elements**: Check selectors and component rendering
3. **Mocking issues**: Ensure mocks are properly configured
4. **Test environment differences**: Use consistent test environments

### Debugging Tips

1. **Use console.log** for debugging test failures
2. **Run individual tests** to isolate issues
3. **Use debugger statements** in test code
4. **Check test output** for detailed error messages

### Performance Issues

1. **Slow test execution**: Use parallel execution and mock expensive operations
2. **Memory leaks**: Check for proper cleanup in afterEach hooks
3. **Flaky tests**: Use proper waits and avoid race conditions
4. **Coverage gaps**: Review uncovered code paths and add tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)
- [Storybook Testing](https://storybook.js.org/docs/react/writing-tests/introduction)
- [Web Vitals](https://web.dev/vitals/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)