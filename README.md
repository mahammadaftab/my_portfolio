# Professional Portfolio Website

A high-performance, production-ready personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features modern design with dark/light mode, 3D animations, parallax effects, and responsive layout. This portfolio includes all the requested features from the original specification and is ready for immediate deployment.

**Status: ✅ Complete - Ready for Production**

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Dark/Light Mode**: System preference with manual toggle
- **3D Animations**: React Three Fiber for interactive 3D elements
- **Micro-interactions**: Framer Motion for smooth animations and Lottie for micro-animations
- **Parallax Effects**: Scroll-based parallax on hero and projects sections
- **Form Validation**: Zod + React Hook Form with comprehensive error handling
- **SEO Optimized**: Meta tags, sitemap, robots.txt
- **Performance Focused**: Optimized for Lighthouse scores with lazy loading
- **Accessibility**: WCAG compliant with keyboard navigation and prefers-reduced-motion support
- **Email Integration**: Resend for contact form submissions
- **Rate Limiting**: Upstash Redis for API protection
- **Analytics**: Google Analytics and Plausible support
- **PDF Viewer**: Custom PDF.js implementation for resume preview
- **Modals & Lightboxes**: For detailed project and certificate views
- **CI/CD**: GitHub Actions for automated testing and deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
```

2. Navigate to the project directory:
```bash
cd portfolio
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
portfolio/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable UI components
│   ├── data/                # JSON data files
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── styles/                  # Global styles
├── .github/workflows/       # GitHub Actions
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Customization

### Update Personal Information

1. **Metadata**: Update [src/app/layout.tsx](src/app/layout.tsx) with your name and description
2. **Projects**: Modify [src/data/projects.json](src/data/projects.json) with your projects
3. **Experience**: Update [src/data/experience.json](src/data/experience.json) with your work history
4. **Contact Info**: Edit contact information in [src/app/contact/page.tsx](src/app/contact/page.tsx)
5. **Resume**: Add your resume files and update paths in [src/app/resume/page.tsx](src/app/resume/page.tsx)
6. **Skills**: Update skills and proficiency levels in [src/app/skills/page.tsx](src/app/skills/page.tsx)
7. **About**: Update bio and timeline in [src/app/about/page.tsx](src/app/about/page.tsx)

See [Customization Guide](docs/customization-guide.md) for detailed instructions.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# For contact form (replace with your service)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com

# For analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-plausible-domain.com

# For rate limiting (optional, for production)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy!

### Other Platforms

The project can also be deployed to:
- Netlify
- Render
- AWS Amplify

## Performance Checklist

- [ ] Optimize images (use WebP format)
- [ ] Minimize JavaScript bundles
- [ ] Implement lazy loading for images
- [ ] Add caching headers
- [ ] Enable compression (gzip/brotli)
- [ ] Optimize font loading
- [ ] Reduce unused CSS
- [ ] Implement proper error boundaries

## Testing

Run the development server:
```bash
npm run dev
```

Run linting:
```bash
npm run lint
```

Run type checking:
```bash
npm run type-check
```

Run tests (if configured):
```bash
npm run test
```

## Dependencies

### Core
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### UI & Animation
- Framer Motion
- React Three Fiber
- React Three Drei
- Lottie React

### Forms & Validation
- React Hook Form
- Zod
- @hookform/resolvers

### Email & Rate Limiting
- Resend
- @upstash/redis
- @upstash/ratelimit

### PDF Handling
- pdfjs-dist

### Utilities
- next-themes (dark mode)
- react-icons
- @headlessui/react

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

See [Enhancements Summary](docs/enhancements-summary.md) for a complete list of features and improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.