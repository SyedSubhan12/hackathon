"use client";

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import ReportHeader from '@/components/report/ReportHeader';
import OCRTable from '@/components/report/OCRTable';
import ExplanationAccordion from '@/components/report/ExplanationAccordion';
import RiskSummaryCard from '@/components/report/RiskSummaryCard';
import DownloadButton from '@/components/report/DownloadButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, FileQuestion } from 'lucide-react';
import Image from 'next/image';

// Define a type for the lab result item, mirroring backend structure
export interface LabResultItem {
  test_name: string;
  value: string;
  unit: string;
  reference_range: string;
  // Add other potential fields if known, e.g., flag, notes
  flag?: 'Normal' | 'Abnormal' | 'High' | 'Low' | string; 
}

// Define a type for the full report data
export interface ReportData {
  id: number;
  filename: string;
  processed_date: string;
  raw_text?: string; // Assuming raw_text might be large and optional for main display
  lab_results: LabResultItem[];
  // Add other top-level fields from API if any
}

const fetcher = async (url: string): Promise<ReportData> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorInfo = await res.json().catch(() => ({})); // Try to parse error, default to empty object
    throw new Error(errorInfo.error || `An error occurred while fetching the data: ${res.statusText}`);
  }
  return res.json();
};

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;

  // Use NEXT_PUBLIC_API_URL if defined, otherwise default to localhost for dev
  const apiUrlBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const { data: report, error, isLoading } = useSWR<ReportData>(id ? `${apiUrlBase}/reports/${id}` : null, fetcher);

  if (isLoading) {
    return <ReportPageSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Report</AlertTitle>
        <AlertDescription>
          Could not load report data: {error.message}. Please try again later or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!report) {
    return (
       <Alert className="max-w-2xl mx-auto bg-card">
        <FileQuestion className="h-4 w-4" />
        <AlertTitle>Report Not Found</AlertTitle>
        <AlertDescription>
          The requested report could not be found. It might have been moved or deleted.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <ReportHeader filename={report.filename} processedDate={report.processed_date} reportId={report.id}/>
      
      {/* Optional: Report Preview could go here if implemented */}
      {/* <ReportPreview reportUrl={`/api/reports/${report.id}/preview`} /> */}
       <div className="bg-card p-6 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold text-primary mb-4">Extracted Data</h2>
         <OCRTable labResults={report.lab_results} />
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-primary mb-4">AI-Powered Explanation</h2>
          <ExplanationAccordion labResultsData={report.lab_results} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RiskSummaryCard labResultsData={report.lab_results} />
          <DownloadButton reportId={report.id} filename={report.filename} />
        </div>
      </div>
       <div className="bg-card p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-xl font-semibold text-primary mb-3">Original Report Snippet (Mock)</h3>
          <Image 
            src="https://placehold.co/800x600.png" 
            alt="Mockup of an original lab report"
            width={800} 
            height={600}
            className="rounded-md border border-border"
            data-ai-hint="document medical"
          />
          <p className="text-xs text-muted-foreground mt-2">This is a placeholder image representing the original uploaded document.</p>
        </div>
    </div>
  );
}

function ReportPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-10 w-32" />
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
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
