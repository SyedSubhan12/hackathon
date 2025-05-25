// src/components/landing/FeatureGrid.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, Brain, ShieldCheck, Download, BarChart3 } from 'lucide-react'; // Updated Brain
import { ReactElement } from "react";
import { motion } from "framer-motion";

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <UploadCloud className="h-10 w-10 text-primary" />,
    title: "Easy Upload",
    description: "Simply drag & drop or select your lab report files (PDF, JPG, PNG, TIFF, BMP). User-friendly and intuitive.",
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Automated Data Extraction",
    description: "Advanced OCR and NLP accurately extract key data like test names, values, and reference ranges.",
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "AI-Powered Explanations",
    description: "Understand complex medical terms with AI-generated explanations in simple, patient-friendly language.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Clear Data Visualization",
    description: "View your extracted data in a structured table, highlighting important results and trends clearly.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "Secure & Private",
    description: "Your health data is handled with utmost security and privacy using robust protective measures.",
  },
   {
    icon: <Download className="h-10 w-10 text-primary" />,
    title: "Downloadable Summaries",
    description: "Get a concise summary of your results and AI explanations for your records or to share (feature coming soon).",
  },
];

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
      duration: 0.4
    },
  },
};

export default function FeatureGrid() {
  return (
    <motion.section 
      id="features" 
      className="py-16 md:py-20 bg-muted/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={gridContainerVariants} // Apply container variants here for overall section entrance
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-primary"
          variants={cardVariants} // Reuse cardVariants for simplicity or define specific title variants
        >
          Why Choose LabLex?
        </motion.h2>
        <motion.p 
          className="text-muted-foreground text-lg text-center mb-12 md:mb-16 max-w-3xl mx-auto"
          variants={cardVariants}
        >
          LabLex offers a suite of powerful features designed to make your health journey simpler, more informed, and secure.
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridContainerVariants} // Stagger children for cards
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-card rounded-xl overflow-hidden group transform hover:-translate-y-1">
                <CardHeader className="flex flex-col items-center text-center gap-4 p-6 bg-background/30 border-b border-border group-hover:bg-primary/5 transition-colors">
                  <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/90">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
