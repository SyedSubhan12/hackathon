import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, Lightbulb, Lock, Download, BarChart3, Brain, ShieldCheck } from 'lucide-react';
import { ReactElement } from "react";

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
    icon: <Brain className="h-10 w-10 text-primary" />, // Replaced Lightbulb with Brain for AI
    title: "AI-Powered Explanations",
    description: "Understand complex medical terms with AI-generated explanations in simple, patient-friendly language.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Clear Data Visualization",
    description: "View your extracted data in a structured table, highlighting important results and trends clearly.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />, // Replaced Lock with ShieldCheck for a more active security feel
    title: "Secure & Private",
    description: "Your health data is handled with utmost security and privacy using robust protective measures.",
  },
   {
    icon: <Download className="h-10 w-10 text-primary" />, // Kept Download
    title: "Downloadable Summaries",
    description: "Get a concise summary of your results and AI explanations for your records or to share (feature coming soon).",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-primary">
          Why Choose LabLex?
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          LabLex offers a suite of powerful features designed to make your health journey simpler, more informed, and secure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-card rounded-xl overflow-hidden group transform hover:-translate-y-1">
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
          ))}
        </div>
      </div>
    </section>
  );
}
