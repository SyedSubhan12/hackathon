import { FileText, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface ReportHeaderProps {
  filename: string;
  processedDate: string;
  reportId: number;
}

export default function ReportHeader({ filename, processedDate, reportId }: ReportHeaderProps) {
  const formattedDate = processedDate ? format(new Date(processedDate), 'MMMM dd, yyyy HH:mm') : 'N/A';

  return (
    <div className="bg-card p-6 rounded-lg shadow-md mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <FileText size={28} />
            Report Details
          </h1>
          <p className="text-lg text-muted-foreground mt-1 truncate max-w-md" title={filename}>
            {filename}
          </p>
        </div>
        <div className="text-sm text-muted-foreground text-left sm:text-right space-y-1">
           <p className="flex items-center gap-1">
            <CalendarDays size={16} />
            Processed: {formattedDate}
          </p>
          <p>Report ID: <span className="font-medium text-foreground">{reportId}</span></p>
        </div>
      </div>
    </div>
  );
}
