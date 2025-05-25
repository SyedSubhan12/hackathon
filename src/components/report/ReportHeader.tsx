// src/components/report/ReportHeader.tsx
import { FileText, CalendarDays, Info, Brain } from 'lucide-react'; // Added Brain for AI model
import { format } from 'date-fns';
import type { ProcessingInfo } from '@/types/report';

interface ReportHeaderProps {
  filename: string;
  processedDate: string; // ISO string or timestamp
  reportId: string; 
  processingInfo?: ProcessingInfo;
}

export default function ReportHeader({ filename, processedDate, reportId, processingInfo }: ReportHeaderProps) {
  let formattedDate = 'N/A';
  try {
    const dateObj = new Date(processedDate);
    // Check if date is valid after parsing
    if (!isNaN(dateObj.getTime())) {
      formattedDate = format(dateObj, 'MMMM dd, yyyy p'); // Using 'p' for localized time
    }
  } catch (e) {
    console.warn("Failed to format processedDate", processedDate);
  }
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-xl mb-8 border border-primary/20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <FileText size={32} strokeWidth={2.5} />
            <span>Lab Report Analysis</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-1.5 truncate max-w-md" title={filename}>
            File: <span className="font-medium text-foreground">{filename}</span>
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-left sm:text-right space-y-1.5 mt-4 sm:mt-0">
           <p className="flex items-center gap-1.5 justify-start sm:justify-end">
            <CalendarDays size={16} className="text-primary" />
            <span>Analyzed:</span>
            <span className="font-medium text-foreground">{formattedDate}</span>
          </p>
          <p className="flex items-center gap-1.5 justify-start sm:justify-end">
            <Info size={16} className="text-primary" />
            <span>Display ID:</span>
            <span className="font-medium text-foreground">{reportId}</span>
          </p>
          {processingInfo?.ai_model && (
            <p className="flex items-center gap-1.5 justify-start sm:justify-end">
              <Brain size={16} className="text-primary" /> 
              <span>AI Model:</span>
              <span className="font-medium text-foreground">{processingInfo.ai_model}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
