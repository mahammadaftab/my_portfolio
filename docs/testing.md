# Testing Guide

This guide provides comprehensive instructions for testing the portfolio website, including unit tests, integration tests, and end-to-end tests.

## Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Component Testing](#component-testing)
6. [Accessibility Testing](#accessibility-testing)
7. [Performance Testing](#performance-testing)
8. [Visual Regression Testing](#visual-regression-testing)
9. [Continuous Testing](#continuous-testing)

## Testing Strategy

The portfolio website follows a comprehensive testing strategy that includes:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between components and modules
3. **End-to-End Tests**: Test complete user workflows
4. **Component Tests**: Test UI components in isolation
5. **Accessibility Tests**: Ensure WCAG compliance
6. **Performance Tests**: Validate loading and runtime performance
7. **Visual Regression Tests**: Catch unintended visual changes

## Unit Testing

### Setup

Unit tests are written using Jest and React Testing Library.

Install dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Writing Unit Tests

Create test files with `.test.ts` or `.test.tsx` extension next to the component being tested.

Example test for a utility function:
```typescript
// src/lib/utils.test.ts
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000.5)).toBe('$1,001.00');
  });
});
```

### Running Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Integration Testing

### Testing Component Interactions

Integration tests verify that components work together correctly.

Example test for a form component:
```typescript
// src/components/contact-form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from './contact-form';

describe('ContactForm', () => {
  it('should submit form with valid data', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });
});
```

### Testing API Routes

Test API endpoints to ensure they handle requests correctly.

```typescript
// src/app/api/contact/route.test.ts
import { POST } from './route';

describe('Contact API', () => {
  it('should return success for valid data', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello world'
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## End-to-End Testing

### Setup with Cypress

Install Cypress for end-to-end testing:
```bash
npm install --save-dev cypress
```

Create `cypress.config.ts`:
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

### Writing E2E Tests

Create test files in `cypress/e2e/` directory.

Example test for navigation:
```javascript
// cypress/e2e/navigation.cy.js
describe('Navigation', () => {
  it('should navigate between pages', () => {
    cy.visit('/');
    cy.get('[data-testid="navbar"]').should('be.visible');
    
    cy.get('[href="/projects"]').click();
    cy.url().should('include', '/projects');
    cy.get('h1').contains('My Projects');
    
    cy.get('[href="/contact"]').click();
    cy.url().should('include', '/contact');
    cy.get('h1').contains('Get In Touch');
  });
});
```

### Running E2E Tests

```bash
# Open Cypress UI
npm run cypress:open

# Run tests in headless mode
npm run cypress:run
```

## Component Testing

### Setup with Storybook

Install Storybook for component development and testing:
```bash
npx storybook init
```

### Writing Component Stories

Create story files with `.stories.tsx` extension.

Example story for a button component:
```typescript
// src/components/button.stories.tsx
import { Button } from './button';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};
```

### Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for deployment
npm run build-storybook
```

## Accessibility Testing

### Setup

Install accessibility testing tools:
```bash
npm install --save-dev axe-core @axe-core/react
```

### Automated Accessibility Tests

Add accessibility tests to your component tests:
```typescript
// src/components/navbar.test.tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Navbar from './navbar';

describe('Navbar', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Navbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Testing

Use browser extensions for manual testing:
1. [axe DevTools](https://www.deque.com/axe/devtools/)
2. [WAVE Evaluation Tool](https://wave.webaim.org/extension/)

## Performance Testing

### Lighthouse Integration

Run Lighthouse audits programmatically:
```bash
npm install --save-dev lighthouse
```

Create a performance test script:
```javascript
// scripts/performance-test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'html', onlyCategories: ['performance'] };
  const runnerResult = await lighthouse(url, options);
  
  // Process results
  console.log('Performance Score:', runnerResult.lhr.categories.performance.score * 100);
  
  await chrome.kill();
}

runLighthouse('http://localhost:3000');
```

### Web Vitals Testing

Monitor Core Web Vitals in your tests:
```typescript
// src/lib/web-vitals.test.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

describe('Web Vitals', () => {
  it('should measure core web vitals', () => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
});
```

## Visual Regression Testing

### Setup with Chromatic

Install Chromatic for visual testing:
```bash
npm install --save-dev chromatic
```

### Running Visual Tests

```bash
# Run visual regression tests
npx chromatic --project-token=YOUR_PROJECT_TOKEN
```

### Storybook Visual Testing

Chromatic integrates with Storybook to automatically capture and compare component visuals:
```bash
# Build Storybook and run visual tests
npx chromatic --build-script-name=build-storybook
```

## Continuous Testing

### GitHub Actions Integration

The project includes CI workflow in [.github/workflows/ci.yml](../.github/workflows/ci.yml) that runs tests automatically.

### Test Coverage

Configure Jest to collect coverage:
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
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

### Test Reporting

Generate test reports for CI:
```bash
npm run test -- --coverage --testResultsProcessor=jest-junit
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

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/guides/overview/why-cypress)
- [Storybook Testing](https://storybook.js.org/docs/react/writing-tests/introduction)
- [Web Vitals](https://web.dev/vitals/)