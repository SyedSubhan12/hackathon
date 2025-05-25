// src/components/report/RiskSummaryCard.tsx -> Renamed to RiskSummaryDisplay.tsx
"use client";

import type { AiAnalysis } from '@/types/report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '../ui/alert';

interface RiskSummaryDisplayProps {
  aiAnalysisData?: AiAnalysis;
}

export default function RiskSummaryDisplay({ aiAnalysisData }: RiskSummaryDisplayProps) {
  
  if (!aiAnalysisData) {
    return (
      <Card className="shadow-lg border-muted bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Info className="h-6 w-6 text-muted-foreground" />
            AI Risk Assessment
          </CardTitle>
          <CardDescription>Analysis not available.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">The AI-generated risk assessment could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  const { summary, abnormal_results, total_tests, abnormal_count, model_used, error: aiError } = aiAnalysisData;

  // Determine overall risk level text/icon based on abnormal_count or summary keywords.
  // This is a simplified heuristic. The Python backend could provide a specific risk_level enum.
  let riskLevelText = "Analysis";
  let RiskIcon = Info;
  let cardStyle = "border-muted bg-card";
  let titleColor = "text-foreground";

  if (abnormal_count > 0 && abnormal_count <= 2) { // Example heuristic
    riskLevelText = `Low Concern (${abnormal_count} item${abnormal_count > 1 ? 's' : ''} flagged)`;
    RiskIcon = AlertTriangle; // Could use a less severe icon
    cardStyle = "border-yellow-500/70 bg-yellow-500/10";
    titleColor = "text-yellow-700 dark:text-yellow-500";
  } else if (abnormal_count > 2) {
    riskLevelText = `Moderate/High Concern (${abnormal_count} items flagged)`;
    RiskIcon = AlertTriangle;
    cardStyle = "border-destructive/70 bg-destructive/10";
    titleColor = "text-destructive";
  } else if (abnormal_count === 0 && total_tests > 0) {
    riskLevelText = "Normal Range";
    RiskIcon = CheckCircle2;
    cardStyle = "border-green-500/70 bg-green-500/10";
    titleColor = "text-green-700 dark:text-green-500";
  }


  if (aiError) {
     return (
      <Card className={cn("shadow-lg", "border-destructive/70 bg-destructive/10")}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl text-destructive">
            <AlertTriangle className="h-6 w-6" />
            AI Analysis Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive" className="mb-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>AI Analysis Error</AlertTitle>
                <AlertDescription>{aiAnalysisData.error || "The AI model encountered an issue."}</AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">
                {summary} {/* Display fallback summary if AI failed */}
            </p>
            <p className="mt-4 text-xs text-muted-foreground italic">
            Model: {model_used}. Please consult your doctor for interpretation.
            </p>
        </CardContent>
      </Card>
     )
  }


  return (
    <Card className={cn("shadow-lg", cardStyle)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <RiskIcon className={cn("h-6 w-6", titleColor)} />
          <span className={titleColor}>AI Summary</span>
        </CardTitle>
        <CardDescription className={cn(titleColor, "opacity-80")}>
          {riskLevelText}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1 text-foreground/90">Key Points:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
          </div>

          {abnormal_results && abnormal_results.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-1 text-foreground/90 flex items-center gap-1">
                <ListChecks size={16} /> Flagged Results ({abnormal_count}/{total_tests}):
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                {abnormal_results.map((item, index) => (
                  <li key={index} className="text-destructive/90">{item}</li>
                ))}
              </ul>
            </div>
          )}
           {abnormal_count === 0 && total_tests > 0 && (
             <p className="text-sm text-green-700 dark:text-green-500">All {total_tests} analyzed tests appear within their normal reference ranges.</p>
           )}

        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          AI Model: {model_used}.
        </p>
        <p className="mt-1 text-xs text-muted-foreground italic">
          This is an AI-generated summary for informational purposes. Always consult with a healthcare professional.
        </p>
      </CardContent>
    </Card>
  );
}
