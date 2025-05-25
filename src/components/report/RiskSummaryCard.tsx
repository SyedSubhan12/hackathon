
"use client";

import type { LabResultItem } from '@/app/report/[id]/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { generateRiskAssessment, GenerateRiskAssessmentOutput } from '@/ai/flows/generate-risk-assessment';
import { Alert, AlertDescription } from '../ui/alert';

interface RiskSummaryCardProps {
  labResultsData: LabResultItem[];
  // patientContext?: string; // Optional: if we want to pass more context later
}

export default function RiskSummaryCard({ labResultsData }: RiskSummaryCardProps) {
  const [assessment, setAssessment] = useState<GenerateRiskAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (labResultsData && labResultsData.length > 0) {
      setIsLoading(true);
      setError(null);
      generateRiskAssessment({ labResults: labResultsData })
        .then(setAssessment)
        .catch(err => {
          console.error("Error generating risk assessment:", err);
          setError(err instanceof Error ? err.message : "Failed to load AI assessment.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      setAssessment(null); // No data to assess
    }
  }, [labResultsData]);

  const getCardStyles = () => {
    if (isLoading || !assessment || error) {
      return "border-muted bg-card"; // Neutral style during load or if no assessment
    }
    switch (assessment.overallRiskLevel) {
      case "High":
        return "border-destructive/70 bg-destructive/10";
      case "Moderate":
        return "border-yellow-500/70 bg-yellow-500/10"; // Consider adding yellow to theme or use accent
      case "Low":
        return "border-blue-500/70 bg-blue-500/10"; // Consider using accent or another color
      case "Normal":
        return "border-green-500/70 bg-green-500/10";
      default:
        return "border-muted bg-card";
    }
  };
  
  const getRiskIcon = () => {
    if (isLoading || !assessment || error) return <Info className="h-6 w-6 text-muted-foreground" />;
    switch (assessment.overallRiskLevel) {
      case "High":
      case "Moderate":
        return <AlertTriangle className={`h-6 w-6 ${assessment.overallRiskLevel === "High" ? "text-destructive" : "text-yellow-600"}`} />;
      case "Low":
      case "Normal":
        return <CheckCircle2 className={`h-6 w-6 ${assessment.overallRiskLevel === "Normal" ? "text-green-600" : "text-blue-600"}`} />;
      default:
        return <Info className="h-6 w-6 text-muted-foreground" />;
    }
  };

   const getRiskTitleColor = () => {
    if (isLoading || !assessment || error) return "text-foreground";
    switch (assessment.overallRiskLevel) {
      case "High": return "text-destructive";
      case "Moderate": return "text-yellow-700 dark:text-yellow-500";
      case "Low": return "text-blue-700 dark:text-blue-500";
      case "Normal": return "text-green-700 dark:text-green-500";
      default: return "text-foreground";
    }
  };


  return (
    <Card className={cn("shadow-lg", getCardStyles())}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          {getRiskIcon()}
          <span className={getRiskTitleColor()}>
            AI Risk Assessment
          </span>
        </CardTitle>
        <CardDescription className={cn(getRiskTitleColor(), "opacity-80")}>
          {isLoading ? "Analyzing results..." : assessment?.overallRiskLevel ? `Overall Risk Level: ${assessment.overallRiskLevel}` : "Automated analysis based on provided data."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Generating AI assessment...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Assessment Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : assessment ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1 text-foreground/90">Summary:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{assessment.riskSummary}</p>
            </div>
            {assessment.followUpSuggestions && assessment.followUpSuggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-1 text-foreground/90">Follow-up Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {assessment.followUpSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No lab results provided or assessment could not be generated.</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground italic">
          This is an AI-generated summary and should not replace professional medical advice. Always consult with a healthcare professional for diagnosis and treatment.
        </p>
      </CardContent>
    </Card>
  );
}
