# Professional Portfolio Website

A high-performance, production-ready personal portfolio website built with Next.js, TypeScript, and modern web technologies. Features a stunning dark theme with glassmorphism effects, 3D animations, and full responsiveness.

## 🚀 Features

- **Modern Design**: Dark theme with glassmorphism panels and neon gradients
- **3D Animations**: React Three Fiber for interactive 3D scenes
- **Smooth Animations**: Framer Motion for UI transitions and micro-interactions
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **SEO Optimized**: Meta tags, structured data, and performance optimization
- **Contact Form**: Serverless backend with spam protection
- **Theme Toggle**: Dark/light mode with system preference detection
- **Performance**: Lighthouse score 90+ with optimized images and code splitting

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, React Three Fiber, Lottie
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State**: React Context (Theme)

### Backend
- **API**: Next.js API Routes
- **Email**: Resend/SendGrid integration ready
- **Validation**: Zod schemas

### Development
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Testing Library
- **Git Hooks**: Husky + lint-staged
- **Type Safety**: TypeScript strict mode

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   # Email Service (choose one)
   RESEND_API_KEY=your_resend_api_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   
   # Analytics (optional)
   GOOGLE_ANALYTICS_ID=your_ga_id
   PLAUSIBLE_DOMAIN=your_domain
   
   # Contact Form
   CONTACT_EMAIL=your_email@example.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Personal Information

1. **Update your details** in the following files:
   - `src/data/projects.ts` - Add your projects
   - `src/data/experience.ts` - Add your work experience
   - `src/data/certificates.ts` - Add your certificates
   - `src/data/skills.ts` - Customize your skills

2. **Replace placeholder content**:
   - Update `src/app/layout.tsx` with your SEO metadata
   - Replace placeholder images in `public/images/`
   - Update social links in components

3. **Add your assets**:
   - Profile photo: `public/images/profile.jpg`
   - Project images: `public/images/projects/`
   - Certificate images: `public/images/certificates/`
   - Resume PDF: `public/resume.pdf`

### Styling

- **Colors**: Update CSS variables in `src/app/globals.css`
- **Fonts**: Modify font imports in `src/app/layout.tsx`
- **Components**: Customize UI components in `src/components/ui/`

### Content Management

For dynamic content, consider integrating:
- **Sanity CMS**: For projects and blog posts
- **Contentful**: For content management
- **Notion API**: For simple content updates

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main

### Other Platforms

- **Netlify**: Works with Next.js static export
- **Railway**: Full-stack deployment
- **AWS Amplify**: Enterprise-grade hosting

## 📧 Contact Form Setup

### Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Update `src/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In your POST handler:
await resend.emails.send({
  from: 'contact@yourdomain.com',
  to: process.env.CONTACT_EMAIL,
  subject: `Portfolio Contact: ${data.subject}`,
  html: `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `,
});
```

### Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Install SendGrid: `npm install @sendgrid/mail`
4. Update the contact route with SendGrid integration

### Option 3: EmailJS

1. Sign up at [emailjs.com](https://emailjs.com)
2. Configure email service
3. Update the contact form to use EmailJS client

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

The portfolio is optimized for performance:

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Excellent LCP, FID, CLS
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Use `npm run analyze` to check bundle size

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── 3d/                # Three.js components
│   ├── layout/            # Layout components
│   ├── navigation/        # Navigation components
│   ├── sections/          # Page sections
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts
├── data/                  # Static data
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## 🎯 TODO Checklist

Before going live, make sure to:

- [ ] Replace all placeholder content with your information
- [ ] Add your actual project images and links
- [ ] Update social media links
- [ ] Configure email service for contact form
- [ ] Add your resume PDF
- [ ] Update SEO metadata
- [ ] Test contact form functionality
- [ ] Verify all links work correctly
- [ ] Test on different devices and browsers
- [ ] Run Lighthouse audit
- [ ] Set up analytics (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D library
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives

## 📞 Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Contact me directly
- Check the documentation

---

**Happy coding! 🚀**