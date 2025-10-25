'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, FileText, ExternalLink } from 'lucide-react';

export function ResumeSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (version: 'original' | 'compressed') => {
    // TODO: Implement actual download functionality
    const filename = version === 'compressed' ? 'resume-compressed.pdf' : 'resume.pdf';
    console.log(`Downloading ${filename}`);
    
    // For now, just show an alert - replace with actual download logic
    alert(`Downloading ${filename}...`);
  };

  return (
    <section id="resume" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Resume</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Download my resume or view it online
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Resume Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4">
                  Full Stack Developer & UI/UX Designer
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Passionate about creating exceptional digital experiences through innovative design 
                  and cutting-edge technology. 5+ years of experience building scalable web applications.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span>• React & Next.js Expert</span>
                  <span>• Cloud Architecture (AWS, GCP)</span>
                  <span>• UI/UX Design</span>
                  <span>• Team Leadership</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              variant="glow"
              onClick={() => setIsPreviewOpen(true)}
              className="group"
            >
              <Eye className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Preview Resume
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleDownload('original')}
              className="group"
            >
              <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              Download PDF
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleDownload('compressed')}
              className="group"
            >
              <FileText className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Compressed Version
            </Button>
          </motion.div>

          {/* Resume Preview Modal */}
          {isPreviewOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsPreviewOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-xl font-semibold">Resume Preview</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload('original')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPreviewOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                
                <div className="h-[calc(90vh-80px)]">
                  {/* TODO: Replace with actual PDF viewer component */}
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        PDF Preview will be implemented here
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        TODO: Add PDF.js or similar viewer
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Resume Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-4 gap-6"
          >
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Certifications</div>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">20+</div>
                <div className="text-muted-foreground">Technologies</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

