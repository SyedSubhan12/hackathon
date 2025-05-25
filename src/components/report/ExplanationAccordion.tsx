// src/components/report/ExplanationAccordion.tsx -> Renamed to ExplanationSection.tsx

"use client";

import { Lightbulb, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExplanationSectionProps {
  explanation?: string; // The AI-generated explanation string from the backend
}

export default function ExplanationSection({ explanation }: ExplanationSectionProps) {
  if (!explanation) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Explanation Not Available</AlertTitle>
        <AlertDescription>
          The AI-powered explanation could not be loaded or was not provided.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-medium text-primary">
        <Lightbulb className="h-5 w-5" />
        <span>Detailed Analysis & Explanation</span>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
        <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
          {explanation}
        </div>
      </ScrollArea>
       <p className="text-xs text-muted-foreground italic pt-2">
          This explanation is AI-generated based on the provided lab report data. It is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.
        </p>
    </div>
  );
}
