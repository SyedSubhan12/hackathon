// src/components/landing/Hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, duration: 0.5 }
    },
  };

  return (
    <motion.section 
      className="text-center py-16 md:py-24 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-10" style={{backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.3) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
      
      <motion.h1 
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary"
        variants={itemVariants}
      >
        Understand Your Lab Results with <span className="bg-gradient-to-r from-primary via-accent to-orange-500 bg-clip-text text-transparent">LabLex</span>
      </motion.h1>
      <motion.p 
        className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        variants={itemVariants}
      >
        Stop deciphering complex medical jargon. LabLex uses AI to transform your lab reports into clear, actionable insights, helping you take control of your health.
      </motion.p>
      <motion.div 
        className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
        variants={itemVariants}
      >
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group px-8 py-6 text-lg">
          <Link href="#upload">
            Upload Report Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}
