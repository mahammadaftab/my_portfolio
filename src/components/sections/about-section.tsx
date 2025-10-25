'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download, Award, Users, Code, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const highlights = [
    {
      icon: <Code className="h-6 w-6" />,
      title: '5+ Years Experience',
      description: 'Building scalable web applications',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: '10+ Certifications',
      description: 'AWS, Google Cloud, Kubernetes',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '50+ Projects',
      description: 'From startups to enterprise',
    },
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      url: 'https://github.com/yourusername', // TODO: Add your GitHub URL
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/yourusername', // TODO: Add your LinkedIn URL
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      label: 'Twitter',
      url: 'https://twitter.com/yourusername', // TODO: Add your Twitter URL
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      url: 'mailto:your.email@example.com', // TODO: Add your email
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer with a love for creating exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Photo and Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="relative w-80 h-80 mx-auto">
                <Image
                  src="/globe.svg" // TODO: Add your profile image
                  alt="Profile Photo"
                  fill
                  className="rounded-2xl object-cover shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Floating elements around photo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-20 h-20 border-2 border-primary/30 rounded-full flex items-center justify-center"
              >
                <Code className="h-8 w-8 text-primary" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <Award className="h-6 w-6 text-primary" />
              </motion.div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Your Name</h3>
              <p className="text-muted-foreground mb-4">
                Full Stack Developer & UI/UX Designer
              </p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download vCard
              </Button>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">My Story</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a passionate full-stack developer with over 5 years of experience 
                  creating digital solutions that make a difference. My journey began 
                  with a curiosity about how things work, which led me to explore the 
                  world of programming.
                </p>
                <p>
                  I specialize in modern web technologies, with expertise in React, 
                  Node.js, and cloud platforms. I love turning complex problems into 
                  simple, beautiful, and intuitive solutions.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, 
                  contributing to open-source projects, or sharing knowledge with the 
                  developer community.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="text-center p-4 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="text-primary mb-2 flex justify-center">
                        {highlight.icon}
                      </div>
                      <h4 className="font-semibold mb-1">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Let's Connect</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

