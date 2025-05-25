
"use client";

import { useEffect, useState }
from 'react';
import { useParams } from 'next/navigation';
import ReportHeader from '@/components/report/ReportHeader';
import OCRTable from '@/components/report/OCRTable';
import ExplanationSection from '@/components/report/ExplanationSection'; // Renamed for clarity
import RiskSummaryDisplay from '@/components/report/RiskSummaryDisplay'; // Renamed for clarity
// import DownloadButton from '@/components/report/DownloadButton'; // Temporarily commented out
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, FileQuestion, Info } from 'lucide-react';
import Image from 'next/image';
import type { FullReportDataFromBackend, BackendLabResultItem, LabResultItem, AiAnalysis, ProcessingInfo } from '@/types/report';

// Helper function to map backend data to frontend LabResultItem
const mapBackendResultsToFrontend = (backendResults: BackendLabResultItem[]): LabResultItem[] => {
  if (!backendResults) return [];
  return backendResults.map(item => {
    let flag: LabResultItem['flag'] = 'Normal';
    if (item.value < item.low) {
      flag = 'Low';
    } else if (item.value > item.high) {
      flag = 'High';
    }
    // Consider if backend provides more specific flags like "Abnormal"
    // For now, deriving based on low/high.

    return {
      test_name: item.test,
      value: item.value.toString(), // OCRTable expects string
      unit: item.unit,
      reference_range: `${item.low} - ${item.high}`,
      flag: flag,
    };
  });
};


export default function ReportPage() {
  const params = useParams();
  const idFromUrl = params.id as string; // This is now mostly for a descriptive URL

  const [reportData, setReportData] = useState<FullReportDataFromBackend | null>(null);
  const [frontendLabResults, setFrontendLabResults] = useState<LabResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedDate, setProcessedDate] = useState<string>(new Date().toISOString()); // Fallback processed date

  useEffect(() => {
    const storedDataString = localStorage.getItem('labReportData');
    if (storedDataString) {
      try {
        const data: FullReportDataFromBackend = JSON.parse(storedDataString);
        if (data.filename && decodeURIComponent(idFromUrl) === data.filename) {
          setReportData(data);
          setFrontendLabResults(mapBackendResultsToFrontend(data.structured_data));
          // Use current date as processedDate as backend doesn't provide it in this structure
          setProcessedDate(new Date().toISOString()); 
        } else {
          setError("Report data in storage does not match the requested report or is invalid.");
        }
        // Clear the data from localStorage after loading it
        // localStorage.removeItem('labReportData'); // Keep for refresh during dev, remove for prod
      } catch (e) {
        console.error("Error parsing report data from localStorage:", e);
        setError("Failed to load report data from local storage. It might be corrupted.");
      }
    } else {
      setError("No report data found. Please upload a report first.");
    }
    setIsLoading(false);
  }, [idFromUrl]);

  if (isLoading) {
    return <ReportPageSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Report</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!reportData) {
    return (
       <Alert className="max-w-2xl mx-auto bg-card">
        <FileQuestion className="h-4 w-4" />
        <AlertTitle>Report Not Found</AlertTitle>
        <AlertDescription>
          The report data could not be loaded. Please try uploading the report again.
        </AlertDescription>
      </Alert>
    );
  }
  
  // The Python backend doesn't assign a persistent ID in the response for this flow.
  // We use a placeholder or derive one if needed for components like DownloadButton (which is currently disabled).
  const displayReportId = reportData.processing_info?.extracted_text_length || Date.now();


  return (
    <div className="space-y-8">
      <ReportHeader 
        filename={reportData.filename} 
        processedDate={processedDate} // Using client-generated date
        reportId={displayReportId.toString()} // Using a derived/placeholder ID
        processingInfo={reportData.processing_info}
      />
      
       <div className="bg-card p-6 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold text-primary mb-4">Extracted Lab Results</h2>
         {frontendLabResults.length > 0 ? (
            <OCRTable labResults={frontendLabResults} />
         ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Structured Data</AlertTitle>
              <AlertDescription>
                No structured lab results were extracted from this report. The AI analysis below is based on the raw text.
                {reportData.ai_analysis.error && ` (AI Error: ${reportData.ai_analysis.error})`}
              </AlertDescription>
            </Alert>
         )}
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-4">AI-Powered Analysis</h2>
          <ExplanationSection explanation={reportData.ai_analysis.explanation} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RiskSummaryDisplay aiAnalysisData={reportData.ai_analysis} />
          {/* 
          <DownloadButton 
            reportId={displayReportId} // Needs a real, persistent ID if re-enabled
            filename={reportData.filename} 
          /> 
          */}
        </div>
      </div>

       {reportData.raw_text_preview && (
        <div className="bg-card p-6 rounded-lg shadow-md mt-8">
            <h3 className="text-xl font-semibold text-primary mb-3">Raw Text Preview</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/30 p-4 rounded-md max-h-60 overflow-y-auto">
              {reportData.raw_text_preview}
            </pre>
        </div>
       )}
       
       <div className="bg-card p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-semibold text-primary mb-3">Original Report Snippet (Placeholder)</h3>
          <Image 
            src="https://placehold.co/800x600.png" 
            alt="Mockup of an original lab report"
            width={800} 
            height={600}
            className="rounded-md border border-border"
            data-ai-hint="document medical"
          />
          <p className="text-xs text-muted-foreground mt-2">This is a placeholder image representing the original uploaded document. A future feature could show the actual document.</p>
        </div>
    </div>
  );
}

function ReportPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-3/5" />
        {/* <Skeleton className="h-10 w-32" /> */}
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-md">
        <Skeleton className="h-7 w-1/3 mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
          <Skeleton className="h-7 w-1/2 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <Skeleton className="h-6 w-2/3 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          {/* <Skeleton className="h-12 w-full rounded-md" /> */}
        </div>
      </div>
    </div>
  );
}

