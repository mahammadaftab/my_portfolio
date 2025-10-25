import { Project } from '@/types';

// TODO: Replace with your actual project data
export const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with modern UI and payment integration.',
    longDescription: 'A comprehensive e-commerce platform built with Next.js, featuring user authentication, product management, shopping cart functionality, and secure payment processing. The platform includes admin dashboard, order management, and real-time notifications.',
    image: '/globe.svg',
    liveUrl: 'https://your-ecommerce-demo.com', // TODO: Add your live URL
    githubUrl: 'https://github.com/yourusername/ecommerce-platform', // TODO: Add your GitHub URL
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'PostgreSQL', 'Prisma'],
    category: 'fullstack',
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'AI Chat Application',
    description: 'Real-time chat application with AI-powered features and modern interface.',
    longDescription: 'A sophisticated chat application featuring real-time messaging, AI integration for smart responses, file sharing, and advanced user management. Built with modern web technologies and optimized for performance.',
    image: '/file.svg',
    liveUrl: 'https://your-chat-demo.com', // TODO: Add your live URL
    githubUrl: 'https://github.com/yourusername/ai-chat-app', // TODO: Add your GitHub URL
    techStack: ['React', 'Node.js', 'Socket.io', 'OpenAI API', 'MongoDB', 'Redis'],
    category: 'fullstack',
    featured: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: '3',
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio website with 3D animations and interactive elements.',
    longDescription: 'A cutting-edge portfolio website featuring 3D animations, interactive elements, and modern design principles. Built with performance optimization and accessibility in mind.',
    image: '/window.svg',
    liveUrl: 'https://your-portfolio.com', // TODO: Add your live URL
    githubUrl: 'https://github.com/yourusername/portfolio', // TODO: Add your GitHub URL
    techStack: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
    category: 'frontend',
    featured: false,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  // TODO: Add more projects as needed
];

