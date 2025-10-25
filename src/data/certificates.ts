import { Certificate } from '@/types';

// TODO: Replace with your actual certificate data
export const certificates: Certificate[] = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issueDate: '2023-06-15',
    credentialId: 'AWS-SAA-123456',
    credentialUrl: 'https://drive.google.com/file/d/your-aws-certificate', // TODO: Add your Google Drive URL
    imageUrl: '/images/certificates/aws-saa.jpg',
    description: 'Professional certification demonstrating expertise in designing distributed systems on AWS.',
  },
  {
    id: '2',
    title: 'Google Cloud Professional Developer',
    issuer: 'Google Cloud',
    issueDate: '2023-03-20',
    credentialId: 'GCP-PD-789012',
    credentialUrl: 'https://drive.google.com/file/d/your-gcp-certificate', // TODO: Add your Google Drive URL
    imageUrl: '/images/certificates/gcp-developer.jpg',
    description: 'Certification validating skills in developing applications on Google Cloud Platform.',
  },
  {
    id: '3',
    title: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    issueDate: '2023-09-10',
    credentialId: 'CKA-345678',
    credentialUrl: 'https://drive.google.com/file/d/your-cka-certificate', // TODO: Add your Google Drive URL
    imageUrl: '/images/certificates/cka.jpg',
    description: 'Professional certification demonstrating competency in Kubernetes administration.',
  },
  // TODO: Add more certificates as needed
];

