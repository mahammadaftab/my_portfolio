import { Experience } from '@/types';

// TODO: Replace with your actual experience data
export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Company Inc.',
    position: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    startDate: '2022-01-01',
    current: true,
    description: [
      'Led development of scalable web applications serving 100k+ users',
      'Mentored junior developers and conducted code reviews',
      'Implemented CI/CD pipelines and automated testing processes',
    ],
    achievements: [
      'Reduced application load time by 40% through performance optimization',
      'Led team of 5 developers in delivering major product features',
      'Implemented security best practices resulting in zero security incidents',
    ],
    techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Frontend Developer',
    location: 'Remote',
    startDate: '2020-06-01',
    endDate: '2021-12-31',
    current: false,
    description: [
      'Developed responsive web applications using modern JavaScript frameworks',
      'Collaborated with design team to implement pixel-perfect UI components',
      'Optimized applications for performance and accessibility',
    ],
    achievements: [
      'Improved user engagement by 25% through UI/UX enhancements',
      'Reduced bundle size by 30% through code optimization',
      'Implemented automated testing reducing bugs by 50%',
    ],
    techStack: ['React', 'Vue.js', 'JavaScript', 'CSS3', 'Webpack', 'Jest'],
  },
  // TODO: Add more experience entries as needed
];

