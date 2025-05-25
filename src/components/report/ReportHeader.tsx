// src/components/report/ReportHeader.tsx
import { FileText, CalendarDays, Info } from 'lucide-react';
import { format } from 'date-fns';
import type { ProcessingInfo } from '@/types/report';

interface ReportHeaderProps {
  filename: string;
  processedDate: string; // ISO string
  reportId: string; // Display ID, may not be persistent ID from DB in this flow
  processingInfo?: ProcessingInfo; // Optional processing info from backend
}

export default function ReportHeader({ filename, processedDate, reportId, processingInfo }: ReportHeaderProps) {
  let formattedDate = 'N/A';
  try {
    if (processedDate) {
      formattedDate = format(new Date(processedDate), 'MMMM dd, yyyy HH:mm');
    }
  } catch (e) {
    console.warn("Failed to format processedDate", processedDate);
  }
  

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FileText size={28} />
            Report Analysis
          </h1>
          <p className="text-lg text-muted-foreground mt-1 truncate max-w-md" title={filename}>
            File: {filename}
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-left sm:text-right space-y-1">
           <p className="flex items-center gap-1">
            <CalendarDays size={16} />
            Analyzed: {formattedDate}
          </p>
          <p>Display ID: <span className="font-medium text-foreground">{reportId}</span></p>
          {processingInfo?.ai_model && (
            <p className="flex items-center gap-1">
              <Info size={16} /> AI Model: {processingInfo.ai_model}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
