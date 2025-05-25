// src/app/page.tsx
"use client"; 

import Hero from '@/components/landing/Hero';
import UploadDropzone from '@/components/landing/UploadDropzone';
import FeatureGrid from '@/components/landing/FeatureGrid';
import { motion } from 'framer-motion';

export default function HomePage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <div className="space-y-16 md:space-y-24">
      <Hero /> 
      <motion.section 
        id="upload" 
        className="py-16 md:py-20 bg-card rounded-xl shadow-2xl mx-auto max-w-5xl -mt-10 relative z-10"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-primary">Upload Your Lab Report</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Securely upload your medical lab report (PDF, JPG, PNG, etc.). We'll extract the data and help you understand it.
          </p>
          <UploadDropzone />
        </div>
      </motion.section>
      <FeatureGrid />
    </div>
  );
}
