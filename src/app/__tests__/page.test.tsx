import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components to avoid complex dependencies
jest.mock('@/components/navigation/navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('@/components/sections/hero-section', () => {
  return function MockHeroSection() {
    return <section data-testid="hero">Hero Section</section>;
  };
});

jest.mock('@/components/sections/about-section', () => {
  return function MockAboutSection() {
    return <section data-testid="about">About Section</section>;
  };
});

jest.mock('@/components/sections/skills-section', () => {
  return function MockSkillsSection() {
    return <section data-testid="skills">Skills Section</section>;
  };
});

jest.mock('@/components/sections/projects-section', () => {
  return function MockProjectsSection() {
    return <section data-testid="projects">Projects Section</section>;
  };
});

jest.mock('@/components/sections/experience-section', () => {
  return function MockExperienceSection() {
    return <section data-testid="experience">Experience Section</section>;
  };
});

jest.mock('@/components/sections/resume-section', () => {
  return function MockResumeSection() {
    return <section data-testid="resume">Resume Section</section>;
  };
});

jest.mock('@/components/sections/contact-section', () => {
  return function MockContactSection() {
    return <section data-testid="contact">Contact Section</section>;
  };
});

jest.mock('@/components/layout/footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('Home Page', () => {
  it('renders all main sections', () => {
    render(<Home />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('skills')).toBeInTheDocument();
    expect(screen.getByTestId('projects')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('resume')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders main element with correct class', () => {
    render(<Home />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');
  });
});

