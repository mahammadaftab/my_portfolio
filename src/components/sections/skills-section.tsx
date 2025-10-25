'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills } from '@/data/skills';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const skillCategories = [
  { id: 'all', label: 'All', count: skills.length },
  { id: 'frontend', label: 'Frontend', count: skills.filter(s => s.category === 'frontend').length },
  { id: 'backend', label: 'Backend', count: skills.filter(s => s.category === 'backend').length },
  { id: 'devops', label: 'DevOps', count: skills.filter(s => s.category === 'devops').length },
  { id: 'ai', label: 'AI/ML', count: skills.filter(s => s.category === 'ai').length },
  { id: 'tools', label: 'Tools', count: skills.filter(s => s.category === 'tools').length },
  { id: 'languages', label: 'Languages', count: skills.filter(s => s.category === 'languages').length },
];

export function SkillsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {skillCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="relative"
            >
              {category.label}
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            </Button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + index * 0.05,
                type: 'spring',
                stiffness: 100
              }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
            >
              <Card className={cn(
                'relative overflow-hidden transition-all duration-300 cursor-pointer group',
                hoveredSkill === skill.name && 'shadow-lg scale-105'
              )}>
                <CardContent className="p-6 text-center">
                  {/* Skill Icon/Name */}
                  <div className="mb-4">
                    <div className={cn(
                      'w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-white font-bold text-lg',
                      skill.color ? `bg-[${skill.color}]` : 'bg-primary'
                    )} style={{ backgroundColor: skill.color }}>
                      {skill.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Skill Name */}
                  <h3 className="font-semibold mb-2 text-sm">{skill.name}</h3>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-purple-600"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.05 }}
                    />
                  </div>

                  {/* Level Percentage */}
                  <div className="text-xs text-muted-foreground">
                    {skill.level}%
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: hoveredSkill === skill.name ? 1 : 0 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid md:grid-cols-3 gap-8"
        >
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">
                {skills.filter(s => s.level >= 80).length}
              </div>
              <div className="text-muted-foreground">Expert Level Skills</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">
                {skills.length}
              </div>
              <div className="text-muted-foreground">Total Technologies</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">
                {skillCategories.length - 1}
              </div>
              <div className="text-muted-foreground">Skill Categories</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

