// src/components/report/RiskSummaryDisplay.tsx (formerly RiskSummaryCard.tsx)
"use client";

import type { AiAnalysis } from '@/types/report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, ListChecks, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '../ui/alert'; // Corrected path
import { Badge } from '../ui/badge'; // Corrected path

interface RiskSummaryDisplayProps {
  aiAnalysisData?: AiAnalysis;
}

export default function RiskSummaryDisplay({ aiAnalysisData }: RiskSummaryDisplayProps) {
  
  if (!aiAnalysisData) {
    return (
      <Card className="shadow-xl border-muted bg-card rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Info className="h-6 w-6" />
            AI Risk Assessment
          </CardTitle>
          <CardDescription>Analysis details not available.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">The AI-generated risk assessment could not be loaded or was not provided.</p>
        </CardContent>
      </Card>
    );
  }

  const { summary, abnormal_results, total_tests, abnormal_count, model_used, error: aiError, explanation } = aiAnalysisData;

  let riskLevelText = "Further Review Recommended";
  let RiskIcon = Info;
  let cardStyle = "border-primary/30 bg-card";
  let titleColor = "text-primary";
  let badgeVariant: "default" | "destructive" | "secondary" | "outline" = "secondary";

  if (aiError) {
    riskLevelText = "AI Analysis Error";
    RiskIcon = AlertTriangle;
    cardStyle = "border-destructive bg-destructive/10";
    titleColor = "text-destructive";
    badgeVariant = "destructive";
  } else if (abnormal_count > 0 && abnormal_count <= 2) { 
    riskLevelText = "Some Items Flagged";
    RiskIcon = AlertTriangle; 
    cardStyle = "border-orange-500/70 bg-orange-500/5 dark:bg-orange-500/10";
    titleColor = "text-orange-600 dark:text-orange-400";
    badgeVariant = "destructive"; // Still destructive for abnormal items
  } else if (abnormal_count > 2) {
    riskLevelText = "Multiple Items Flagged";
    RiskIcon = AlertTriangle;
    cardStyle = "border-destructive/70 bg-destructive/5 dark:bg-destructive/10";
    titleColor = "text-destructive";
    badgeVariant = "destructive";
  } else if (abnormal_count === 0 && total_tests > 0) {
    riskLevelText = "Generally Within Normal Ranges";
    RiskIcon = CheckCircle2;
    cardStyle = "border-green-500/70 bg-green-500/5 dark:bg-green-500/10";
    titleColor = "text-green-600 dark:text-green-500";
    badgeVariant = "default";
  }


  if (aiError) {
     return (
      <Card className={cn("shadow-xl rounded-xl", cardStyle)}>
        <CardHeader className="pb-3">
          <CardTitle className={cn("flex items-center gap-2 text-xl", titleColor)}>
            <RiskIcon className="h-6 w-6" />
            {riskLevelText}
          </CardTitle>
        </CardHeader>
        <CardContent>
            <Alert variant="destructive" className="mb-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>AI Analysis Error</AlertTitle>
                <AlertDescription>{aiError || "The AI model encountered an issue processing this report."}</AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">
                {summary || "Summary not available due to error."}
            </p>
            <p className="mt-4 text-xs text-muted-foreground italic">
            Model: {model_used || "N/A"}. Please consult your doctor for interpretation.
            </p>
        </CardContent>
      </Card>
     )
  }


  return (
    <Card className={cn("shadow-xl rounded-xl", cardStyle)}>
      <CardHeader className="pb-4">
        <CardTitle className={cn("flex items-center gap-2 text-xl", titleColor)}>
          <RiskIcon className="h-6 w-6" />
          <span>AI-Generated Summary</span>
        </CardTitle>
        <CardDescription className={cn(titleColor, "opacity-90 font-medium")}>
          {riskLevelText}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1.5 text-foreground/90">Key Observations:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{summary || "No summary provided."}</p>
        </div>

        {abnormal_results && abnormal_results.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground/90 flex items-center gap-1.5">
              <ListChecks size={18} className="text-primary" /> Flagged Results ({abnormal_count} of {total_tests}):
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              {abnormal_results.map((item, index) => {
                const isHigh = item.toLowerCase().includes("(high)");
                const isLow = item.toLowerCase().includes("(low)");
                return (
                  <Badge 
                    key={index} 
                    variant={badgeVariant} 
                    className={cn(
                      "mr-2 mb-1.5 text-xs whitespace-normal py-1 px-2.5 w-full text-left justify-start",
                       badgeVariant === 'default' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-700/30 dark:text-green-400 dark:border-green-600' : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-700/30 dark:text-red-400 dark:border-red-600'
                    )}
                  >
                    {isHigh && <TrendingUp size={14} className="mr-1.5 flex-shrink-0" />}
                    {isLow && <TrendingDown size={14} className="mr-1.5 flex-shrink-0" />}
                    {!isHigh && !isLow && <AlertTriangle size={14} className="mr-1.5 flex-shrink-0" />}
                    {item}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
        {abnormal_count === 0 && total_tests > 0 && (
           <p className="text-sm text-green-700 dark:text-green-500 flex items-center gap-1.5">
            <CheckCircle2 size={18} />All {total_tests} analyzed tests appear within their normal reference ranges.
           </p>
        )}

        <p className="mt-4 text-xs text-muted-foreground/80 pt-3 border-t border-border">
          AI Model: {model_used || "Not specified"}.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80 italic">
          This is an AI-generated summary for informational purposes. Always consult with a healthcare professional for medical advice and decisions.
        </p>
      </CardContent>
    </Card>
  );
}
