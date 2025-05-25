import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, Lightbulb, Lock, Download, BarChart3 } from 'lucide-react';
import { ReactElement } from "react";

interface Feature {
  icon: ReactElement;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: "Easy Upload",
    description: "Simply drag and drop or select your lab report files (PDF, JPG, PNG).",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Automated Data Extraction",
    description: "Our advanced OCR and NLP technology accurately extracts key data from your reports.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Plain Language Explanations",
    description: "Understand complex medical terms with AI-generated explanations in simple language.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Data Visualization",
    description: "View your extracted data in a clear, structured table, highlighting important results.",
  },
  {
    icon: <Download className="h-8 w-8 text-primary" />,
    title: "Downloadable Summaries",
    description: "Get a concise PDF/CSV summary of your results and explanations for your records or to share.",
  },
  {
    icon: <Lock className="h-8 w-8 text-primary" />,
    title: "Secure & Private",
    description: "Your data is handled with the utmost security and privacy.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-2 text-primary">
          Why Choose LabLex?
        </h2>
        <p className="text-muted-foreground text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          LabLex offers a suite of powerful features designed to make your health journey simpler and more informed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card rounded-lg overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 p-6 bg-background/50">
                {feature.icon}
                <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
