# Portfolio Customization Guide

This guide explains how to customize the portfolio website with your personal information, projects, and preferences.

## 1. Personal Information

### Basic Information
Update the following files with your personal details:

1. **Metadata** - `src/app/layout.tsx`
   - Update the `authors` and `creator` fields
   - Update the `title` and `description`
   - Replace placeholder URLs with your domain
   - Update Open Graph and Twitter metadata

2. **Home Page** - `src/app/page.tsx`
   - Update the "Hi, I'm Alex" text with your name
   - Modify the roles array to match your expertise
   - Update the bio text to reflect your background

3. **About Page** - `src/app/about/page.tsx`
   - Replace the placeholder profile photo with your image
   - Update the bio text with your personal story
   - Modify experience numbers and achievements
   - Update the timeline with your work history

4. **Contact Page** - `src/app/contact/page.tsx`
   - Update email, phone, and location information
   - Add links to your social media profiles
   - Update the calendar booking link

### Resume Information
1. **Resume Page** - `src/app/resume/page.tsx`
   - Update the professional summary
   - Modify location, experience, and availability
   - Add your actual resume files to the `public` directory
   - Update file paths to match your resume files

## 2. Projects

### Adding Projects
1. **Project Data** - `src/data/projects.json`
   - Add your projects to the JSON array
   - Include title, description, tags, and image path
   - Add live URL and GitHub repository links
   - Update the image paths to your project screenshots

2. **Project Images**
   - Add project images to the `public/images/projects` directory
   - Use WebP format for optimal performance
   - Ensure images are properly sized for display

### Project Details
To add detailed information for project modals:
1. Edit `src/data/projects.json`
2. Add a `details` field with extended description
3. Add a `technologies` array with tools and frameworks used

## 3. Experience and Certificates

### Work Experience
1. **Experience Data** - `src/data/experience.json`
   - Update the experiences array with your work history
   - Include role, company, period, description, and responsibilities
   - Maintain the existing structure for proper display

### Certificates
1. **Certificate Data** - `src/data/experience.json`
   - Update the certificates array with your credentials
   - Include title, issuer, date, description, and link
   - Upload certificate files to Google Drive or similar service
   - Use public sharing links for the certificate viewer

## 4. Skills

### Skill Categories
1. **Skills Page** - `src/app/skills/page.tsx`
   - Update skill categories to match your expertise areas
   - Modify skill names and proficiency levels
   - Add or remove categories as needed

### Technology Stack
1. **Tech Stack Icons** - `src/app/skills/page.tsx`
   - Update the technology array with tools you work with
   - These appear as animated icons on the skills page

## 5. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# For contact form (replace with your service)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com

# For analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-plausible-domain.com

# For rate limiting (optional, for production)
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_redis_token
```

## 6. Deployment Configuration

### Vercel Deployment
1. Push your code to GitHub
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your GitHub repository
4. Set environment variables in Vercel dashboard
5. Deploy!

### Domain Configuration
1. Update all placeholder URLs in `src/app/layout.tsx`
2. Configure your domain in your DNS provider
3. Add domain to your Vercel project settings
4. Update sitemap and robots.txt if needed

## 7. Analytics Setup

### Google Analytics
1. Create a Google Analytics property
2. Get your Measurement ID
3. Add it to the `NEXT_PUBLIC_GA_ID` environment variable
4. The tracking code is already implemented

### Plausible Analytics
1. Create an account at [Plausible.io](https://plausible.io)
2. Add your domain
3. Get your domain from the Plausible dashboard
4. Add it to the `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable

## 8. Performance Optimization

### Image Optimization
1. Use WebP format for all images
2. Properly size images for their display dimensions
3. Add descriptive alt text to all images
4. Use Next.js Image component for automatic optimization

### Bundle Optimization
1. Regularly audit bundle size with `npm run analyze`
2. Remove unused dependencies
3. Implement code splitting for large components
4. Use dynamic imports for heavy libraries

## 9. Accessibility

### Testing Accessibility
1. Use Lighthouse to audit accessibility
2. Test with screen readers
3. Verify keyboard navigation
4. Check color contrast ratios

### Improving Accessibility
1. Add descriptive alt text to all images
2. Ensure proper heading hierarchy
3. Maintain sufficient color contrast
4. Test with accessibility tools

## 10. Maintenance

### Keeping Dependencies Updated
1. Regularly run `npm outdated` to check for updates
2. Update dependencies with `npm update`
3. Test after updates to ensure functionality
4. Check for security vulnerabilities with `npm audit`

### Content Updates
1. Regularly update projects and experience
2. Add new skills as you learn them
3. Update resume when making changes
4. Refresh portfolio images periodically

## 11. Adding New Sections

To add new sections to your portfolio:

1. Create a new page in `src/app/` directory
2. Follow the existing component patterns
3. Add navigation link to `src/components/navbar.tsx`
4. Add to footer navigation if appropriate
5. Update sitemap if needed

## 12. Troubleshooting

### Common Issues

1. **PDF Viewer Not Working**
   - Ensure PDF files are in the public directory
   - Check file paths in resume page
   - Verify PDF.js worker file is available

2. **Contact Form Not Sending**
   - Verify Resend API key is correct
   - Check environment variables are set
   - Ensure CONTACT_EMAIL is properly configured

3. **Animations Not Working**
   - Check prefers-reduced-motion settings
   - Verify Lottie animation files are available
   - Ensure Framer Motion is properly imported

4. **Deployment Issues**
   - Check environment variables in deployment platform
   - Verify all dependencies are installed
   - Check build logs for errors

### Getting Help
1. Check the console for error messages
2. Review Next.js documentation for framework issues
3. Consult library documentation for specific components
4. Open issues on GitHub if you find bugs

## Conclusion

This customization guide should help you personalize the portfolio website with your information and preferences. The modular structure makes it easy to update content, add new features, and maintain the site over time.

Remember to:
- Regularly update your projects and experience
- Keep dependencies up to date
- Test accessibility and performance
- Backup your customizations before updating
- Monitor analytics to understand visitor behavior

The portfolio is designed to be easily maintainable while providing a professional showcase of your skills and work.