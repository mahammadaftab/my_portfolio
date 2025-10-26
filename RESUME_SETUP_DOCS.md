# Resume Setup Guide

## Overview

This guide explains how to properly set up your resume in the portfolio website.

## Adding Your Resume

### 1. Prepare Your Resume Files

Create the following files in the `public` directory:
- `resume.pdf` - Main PDF resume
- `resume.docx` - Microsoft Word version (optional)
- `resume-compressed.pdf` - Compressed PDF version (optional)

### 2. File Placement

Place all resume files in the `public` directory:
```
public/
├── resume.pdf          # Main resume file
├── resume.docx         # Word document version
└── resume-compressed.pdf # Compressed version
```

### 3. Resume Page Configuration

The resume page (`src/app/resume/page.tsx`) is already configured to:
- Display a preview of `resume.pdf`
- Provide download links for all formats
- Handle missing files gracefully
- Track downloads with analytics

### 4. File Requirements

#### PDF Resume (`resume.pdf`)
- Format: PDF (Portable Document Format)
- Size: Under 5MB for optimal loading
- Resolution: 150-300 DPI
- Pages: 1-2 pages recommended
- Content: Professional experience, skills, education

#### Word Document (`resume.docx`)
- Format: Microsoft Word Document
- Content: Same as PDF version
- Compatibility: Modern Word formats

#### Compressed PDF (`resume-compressed.pdf`)
- Format: PDF
- Size: Reduced file size version
- Quality: Balanced between size and readability

## Error Handling

The resume page includes error handling for missing files:
- Shows a user-friendly message when files are missing
- Disables download buttons for unavailable formats
- Provides contact information as fallback

## Analytics Integration

The resume page tracks downloads using:
- Google Analytics (if configured)
- Plausible Analytics (if configured)
- Custom events for other analytics platforms

To track downloads, ensure your analytics scripts are properly configured in the layout.

## Customization Options

### Update Resume Summary
Edit the professional summary in `src/app/resume/page.tsx`:
```tsx
<p className="text-gray-600 dark:text-gray-400 mb-6">
  {/* Update this text with your professional summary */}
  Senior Frontend Developer with 5+ years of experience...
</p>
```

### Modify Contact Information
Update the contact details in the summary section:
```tsx
<div className="flex flex-wrap gap-4">
  <div className="flex items-center">
    <span className="font-medium text-gray-900 dark:text-white mr-2">Location:</span>
    <span className="text-gray-600 dark:text-gray-400">Your Location</span>
  </div>
  {/* Add or modify other details */}
</div>
```

## Best Practices

### Resume Content
1. Keep it concise (1-2 pages)
2. Use clear, professional language
3. Highlight relevant experience
4. Include measurable achievements
5. Tailor content to your target audience

### File Optimization
1. Compress PDF files to reduce loading times
2. Ensure text is selectable in PDFs
3. Use web-optimized images
4. Maintain consistent formatting

### Accessibility
1. Use proper heading structure
2. Ensure sufficient color contrast
3. Provide alternative text for images
4. Make links descriptive

## Troubleshooting

### File Not Found (404)
If you see a 404 error:
1. Verify files exist in the `public` directory
2. Check file names match exactly:
   - `resume.pdf`
   - `resume.docx`
   - `resume-compressed.pdf`
3. Restart the development server after adding files

### PDF Preview Issues
If the PDF preview doesn't load:
1. Check browser console for errors
2. Verify PDF file is not corrupted
3. Ensure `pdf.worker.min.js` exists in `public` directory
4. Check network tab for loading issues

### Download Tracking Not Working
If analytics tracking isn't working:
1. Verify analytics scripts are loaded
2. Check browser console for JavaScript errors
3. Ensure global window objects are properly defined

## Testing

### Local Testing
1. Place resume files in `public` directory
2. Run development server: `npm run dev`
3. Navigate to `/resume` page
4. Verify preview loads correctly
5. Test download functionality

### Production Testing
1. Build production version: `npm run build`
2. Start production server: `npm start`
3. Test all resume functionality
4. Verify analytics tracking works
5. Check mobile responsiveness

## File Template

You can use the following template structure for your resume:

### Professional Summary
- Brief overview of your experience and expertise
- Key skills and specializations
- Career objectives or availability

### Contact Information
- Location
- Experience level
- Availability status

### Download Options
- Primary PDF download
- Alternative formats (Word, compressed PDF)

### Preview Section
- Embedded PDF viewer
- Error handling for missing files
- Responsive design for all devices

By following this guide, you'll have a fully functional resume section in your portfolio that provides visitors with easy access to your professional credentials.