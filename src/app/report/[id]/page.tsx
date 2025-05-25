// src/app/report/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReportHeader from '@/components/report/ReportHeader';
import OCRTable from '@/components/report/OCRTable';
import ExplanationSection from '@/components/report/ExplanationSection';
import RiskSummaryDisplay from '@/components/report/RiskSummaryDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, FileQuestion, Info, Home } from 'lucide-react';
import Image from 'next/image';
import type { FullReportDataFromBackend, BackendLabResultItem, LabResultItem, AiAnalysis, ProcessingInfo } from '@/types/report';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // Import motion

// Helper function to map backend data to frontend LabResultItem
const mapBackendResultsToFrontend = (backendResults: BackendLabResultItem[]): LabResultItem[] => {
  if (!Array.isArray(backendResults)) return [];
  return backendResults.map(item => {
    let flag: LabResultItem['flag'] = 'Normal'; 
    
    const numericValue = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
    const numericLow = typeof item.low === 'string' ? parseFloat(item.low) : item.low;
    const numericHigh = typeof item.high === 'string' ? parseFloat(item.high) : item.high;

    if (typeof numericValue === 'number' && typeof numericLow === 'number' && numericValue < numericLow) {
      flag = 'Low';
    } else if (typeof numericValue === 'number' && typeof numericHigh === 'number' && numericValue > numericHigh) {
      flag = 'High';
    }
    // Additional flag logic based on Python backend's 'abnormal_results' might be needed if more precise flags are desired.
    // For example, if backend's `ai_analysis.abnormal_results` contains `item.test`, mark as 'Abnormal'.

    return {
      test_name: item.test || 'N/A',
      value: item.value !== undefined && item.value !== null ? String(item.value) : 'N/A',
      unit: item.unit || '',
      reference_range: (item.low !== undefined && item.high !== undefined) ? `${item.low} - ${item.high}` : 'N/A',
      flag: flag,
    };
  });
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const idFromUrl = params.id as string; 

  const [reportData, setReportData] = useState<FullReportDataFromBackend | null>(null);
  const [frontendLabResults, setFrontendLabResults] = useState<LabResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedDate, setProcessedDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const storedDataString = localStorage.getItem('labReportData');
    if (storedDataString) {
      try {
        const data: FullReportDataFromBackend = JSON.parse(storedDataString);
        if (data.filename && decodeURIComponent(idFromUrl) === data.filename) {
          setReportData(data);
          setFrontendLabResults(mapBackendResultsToFrontend(data.structured_data || []));
          setProcessedDate(data.processing_info?.timestamp || new Date().toISOString()); 
        } else {
          setError("Report data mismatch or invalid. Please try uploading again.");
        }
        // Optional: Clear localStorage after loading if desired for one-time transfer
        // localStorage.removeItem('labReportData'); 
      } catch (e) {
        console.error("Error parsing report data from localStorage:", e);
        setError("Failed to load report data. It might be corrupted or in an unexpected format.");
      }
    } else {
      setError("No report data found. Please upload a report first.");
    }
    setIsLoading(false);
  }, [idFromUrl]);

  if (isLoading) {
    return <ReportPageSkeleton />;
  }

  if (error || !reportData) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="destructive" className="max-w-md mx-auto shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-xl font-semibold">Error Loading Report</AlertTitle>
          <AlertDescription className="mt-2">
            {error || "The report data could not be loaded or was not found."}
            <br />
            Please try uploading the report again.
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/')} className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Home className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </motion.div>
    );
  }
  
  const displayReportId = reportData.processing_info?.extracted_text_length?.toString() || Date.now().toString();


  return (
    <div className="space-y-10">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <ReportHeader 
          filename={reportData.filename} 
          processedDate={processedDate}
          reportId={displayReportId} 
          processingInfo={reportData.processing_info}
        />
      </motion.div>
      
       <motion.div 
         className="bg-card p-6 rounded-xl shadow-xl"
         variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
       >
         <h2 className="text-2xl font-semibold text-primary mb-6 border-b pb-3">Extracted Lab Results</h2>
         {frontendLabResults.length > 0 ? (
            <OCRTable labResults={frontendLabResults} />
         ) : (
            <Alert className="bg-muted/50 border-muted-foreground/30">
              <Info className="h-5 w-5 text-muted-foreground" />
              <AlertTitle className="font-medium text-foreground">No Structured Data Found</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                No structured lab results were extracted from this report. The AI analysis below is based on the raw text content.
                {reportData.ai_analysis.error && <span className="block mt-1 text-destructive text-xs">(AI Error: {reportData.ai_analysis.error})</span>}
              </AlertDescription>
            </Alert>
         )}
       </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div 
          className="lg:col-span-2 bg-card p-6 rounded-xl shadow-xl"
          variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-primary mb-6 border-b pb-3">AI-Powered Analysis</h2>
          <ExplanationSection explanation={reportData.ai_analysis.explanation} />
        </motion.div>
        <motion.div 
          className="lg:col-span-1 space-y-8"
          variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
        >
          <RiskSummaryDisplay aiAnalysisData={reportData.ai_analysis} />
          {/* 
          <DownloadButton 
            reportId={displayReportId} 
            filename={reportData.filename} 
          /> 
          */}
        </motion.div>
      </div>

       {reportData.raw_text_preview && (
        <motion.div 
          className="bg-card p-6 rounded-xl shadow-xl mt-10"
          variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
        >
            <h3 className="text-xl font-semibold text-primary mb-4 border-b pb-2">Raw Text Preview (First 500 chars)</h3>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg max-h-72 overflow-y-auto custom-scrollbar">
              {reportData.raw_text_preview}
            </pre>
        </motion.div>
       )}
       
       <motion.div 
         className="bg-card p-6 rounded-xl shadow-xl mt-10"
         variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}
       >
          <h3 className="text-xl font-semibold text-primary mb-4 border-b pb-2">Original Report Snippet (Placeholder)</h3>
          <div className="flex justify-center items-center bg-muted/30 rounded-lg p-4 border border-dashed">
            <Image 
              src="https://placehold.co/800x500.png" 
              alt="Mockup of an original lab report"
              width={800} 
              height={500}
              className="rounded-md border border-border shadow-md object-contain"
              data-ai-hint="document medical report"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">This is a placeholder image representing the original uploaded document. A future feature could display the actual document or a thumbnail.</p>
        </motion.div>
         <motion.div 
           className="text-center mt-12 mb-6"
           variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}
         >
            <Button onClick={() => router.push('/')} variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-base">
             <Home className="mr-2 h-5 w-5" /> Analyze Another Report
            </Button>
        </motion.div>
    </div>
  );
}

function ReportPageSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="flex justify-between items-center bg-card p-6 rounded-xl shadow-xl">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-2 text-right">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-xl shadow-xl">
        <Skeleton className="h-7 w-1/3 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-xl">
          <Skeleton className="h-7 w-1/2 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card p-6 rounded-xl shadow-xl">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-full" />
             <Skeleton className="h-10 w-full mt-4 rounded-md" />
          </div>
        </div>
      </div>
       <div className="bg-card p-6 rounded-xl shadow-xl mt-10">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-48 w-full rounded-lg" />
       </div>
    </div>
  );
}
