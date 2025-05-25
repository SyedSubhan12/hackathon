// src/components/report/ExplanationSection.tsx (formerly ExplanationAccordion.tsx)
"use client";

import { Lightbulb, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownContent from './MarkdownContent'; // Assuming MarkdownContent is in the same directory or adjust path

interface ExplanationSectionProps {
  explanation?: string; 
}

export default function ExplanationSection({ explanation }: ExplanationSectionProps) {
  if (!explanation || explanation.trim() === "") {
    return (
      <Alert variant="default" className="bg-muted/50 border-orange-500/50 text-orange-700 dark:text-orange-400">
        <Info className="h-5 w-5" />
        <AlertTitle className="font-semibold">Explanation Not Available</AlertTitle>
        <AlertDescription>
          The AI-powered explanation could not be loaded or was not provided for this report.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xl font-semibold text-primary">
        <Lightbulb className="h-6 w-6" />
        <span>Detailed AI Analysis</span>
      </div>
      <ScrollArea className="h-[450px] w-full rounded-lg border bg-background p-4 shadow-inner custom-scrollbar">
        {/* Using a basic Markdown-like renderer for the explanation */}
        <MarkdownContent content={explanation} />
      </ScrollArea>
       <p className="text-xs text-muted-foreground italic pt-2 border-t border-border mt-4">
          **Disclaimer:** This explanation is AI-generated based on the provided lab report data. It is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for diagnosis, treatment, and any health-related decisions.
        </p>
    </div>
  );
}
