"use client";

import { useEffect, useState } from 'react';
import { explainLabResults, ExplainLabResultsInput } from '@/ai/flows/explain-lab-results';
import type { LabResultItem } from '@/app/report/[id]/page';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ExplanationAccordionProps {
  labResultsData: LabResultItem[];
}

interface ExplanationItem {
  testName: string;
  explanation: string;
  isLoading: boolean;
  error?: string;
}

export default function ExplanationAccordion({ labResultsData }: ExplanationAccordionProps) {
  const [explanations, setExplanations] = useState<ExplanationItem[]>([]);
  const [isOverallLoading, setIsOverallLoading] = useState(true);

  useEffect(() => {
    if (labResultsData && labResultsData.length > 0) {
      const fetchAllExplanations = async () => {
        setIsOverallLoading(true);
        const initialItems: ExplanationItem[] = labResultsData.map(item => ({
          testName: item.test_name,
          explanation: '',
          isLoading: true,
        }));
        setExplanations(initialItems);

        const updatedItems = await Promise.all(
          labResultsData.map(async (item, index) => {
            try {
              // For simplicity, explaining each item.
              // In a real scenario, might explain only abnormal or selected items,
              // or provide a summary explanation.
              // The current AI flow `explainLabResults` takes all labResults as a single string.
              // We should call it once with all data or adapt the flow if per-item explanation is needed.
              // For now, let's assume we get one overall explanation.
              // Modifying to reflect that `explainLabResults` is designed for the whole report.

              // If we need individual explanations, the AI flow or call pattern must change.
              // Let's make one call for the whole report and display it.
              // The accordion structure might need rethinking if it's one explanation.
              // For now, let's generate one explanation for the whole report and put it in one accordion item.
              if (index === 0) { // Only call once for the first item, representing the whole report
                const input: ExplainLabResultsInput = {
                  labResults: JSON.stringify(labResultsData), // Send all results
                };
                const result = await explainLabResults(input);
                return {
                  testName: "Overall Report Explanation",
                  explanation: result.explanation,
                  isLoading: false,
                };
              }
              // For other items, return a placeholder or skip.
              // For this simplified approach, we will only have one item.
              return null;

            } catch (error) {
              console.error(`Error fetching explanation for ${item.test_name}:`, error);
              return {
                testName: item.test_name,
                explanation: "Could not load explanation for this item.",
                isLoading: false,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          })
        );
        
        // Filter out nulls and update state
        const validItems = updatedItems.filter(item => item !== null) as ExplanationItem[];
        if(validItems.length > 0) {
            setExplanations(validItems);
        } else if (labResultsData.length > 0) { // If no valid items but there was data
             setExplanations([{
                testName: "Report Explanation",
                explanation: "No specific AI explanation generated. Review the raw data.",
                isLoading: false,
                error: "Could not retrieve overall explanation."
            }]);
        }

        setIsOverallLoading(false);
      };

      fetchAllExplanations();
    } else {
      setIsOverallLoading(false);
      setExplanations([]);
    }
  }, [labResultsData]);

  if (isOverallLoading && (!labResultsData || labResultsData.length === 0)) {
     return (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
  }
  
  if (!labResultsData || labResultsData.length === 0) {
    return (
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>No Data for Explanation</AlertTitle>
        <AlertDescription>
          There are no lab results to explain for this report.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Since we expect one overall explanation now:
  const overallExplanationItem = explanations.find(e => e.testName === "Overall Report Explanation");

  if (isOverallLoading) {
     return (
        <div className="space-y-2 p-4 border rounded-md">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      );
  }

  if (!overallExplanationItem && !isOverallLoading) {
     return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Explanation Error</AlertTitle>
        <AlertDescription>
          Could not load the AI-powered explanation for the report. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if(overallExplanationItem) {
    return (
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
        <AccordionItem value="item-0" className="border-b-0">
          <AccordionTrigger className="text-lg font-medium hover:no-underline text-left py-4 rounded-md px-4 bg-muted/30 hover:bg-muted/50 [&[data-state=open]]:rounded-b-none">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              {overallExplanationItem.testName}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-4 text-sm text-muted-foreground leading-relaxed border border-t-0 rounded-b-md">
            {overallExplanationItem.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : overallExplanationItem.error ? (
              <p className="text-destructive">{overallExplanationItem.error}</p>
            ) : (
              <div className="whitespace-pre-wrap">{overallExplanationItem.explanation}</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
  
  return ( // Fallback if somehow overallExplanationItem is not found after loading
    <Alert>
      <Lightbulb className="h-4 w-4" />
      <AlertTitle>Explanation Status</AlertTitle>
      <AlertDescription>
        The AI explanation is currently unavailable.
      </AlertDescription>
    </Alert>
  );

}
