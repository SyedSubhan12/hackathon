import type { LabResultItem } from '@/app/report/[id]/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskSummaryCardProps {
  labResultsData: LabResultItem[];
}

// This is a simplified risk assessment. A real one would be more complex
// and likely driven by the AI explanation or specific rules.
const getPotentialRisks = (labResults: LabResultItem[]): string[] => {
  const risks: string[] = [];
  if (!labResults) return risks;

  labResults.forEach(item => {
    if (item.flag) {
      const flagLower = item.flag.toLowerCase();
      if (flagLower.includes('high') || flagLower.includes('abnormal') || flagLower.includes('positive')) {
        risks.push(`Elevated ${item.test_name} (${item.value} ${item.unit}) may indicate a concern. Reference: ${item.reference_range}.`);
      } else if (flagLower.includes('low')) {
         risks.push(`Low ${item.test_name} (${item.value} ${item.unit}) may indicate a concern. Reference: ${item.reference_range}.`);
      }
    }
  });
  if (risks.length === 0) {
    risks.push("No immediate high-risk flags identified based on automated analysis. Always consult your doctor.");
  }
  return risks;
};

export default function RiskSummaryCard({ labResultsData }: RiskSummaryCardProps) {
  const potentialRisks = getPotentialRisks(labResultsData);
  const hasRisks = potentialRisks.some(risk => !risk.startsWith("No immediate high-risk flags"));

  return (
    <Card className={cn("shadow-lg", hasRisks ? "border-destructive/50 bg-destructive/5" : "border-green-500/50 bg-green-500/5")}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          {hasRisks ? (
            <AlertTriangle className="h-6 w-6 text-destructive" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
          <span className={hasRisks ? "text-destructive" : "text-green-700"}>
            Potential Areas of Focus
          </span>
        </CardTitle>
        <CardDescription className={hasRisks ? "text-destructive/80" : "text-green-600/80"}>
          {hasRisks 
            ? "Highlights based on automated analysis. Not a diagnosis."
            : "Automated analysis did not flag immediate critical risks." }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {potentialRisks.length > 0 ? (
          <ul className="space-y-2 text-sm">
            {potentialRisks.map((risk, index) => (
              <li key={index} className={`flex items-start gap-2 ${risk.startsWith("No immediate") ? 'text-green-700' : 'text-destructive/90'}`}>
                {!risk.startsWith("No immediate") && <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
                 {risk.startsWith("No immediate") && <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No specific risk flags identified in this report.</p>
        )}
        <p className="mt-4 text-xs text-muted-foreground italic">
          This is an automated summary. Always consult with a healthcare professional for medical advice and interpretation of your results.
        </p>
      </CardContent>
    </Card>
  );
}

// Helper to add cn if not present (already in utils)
function cn(...inputs: any[]): string {
  return inputs.filter(Boolean).join(' ');
}

