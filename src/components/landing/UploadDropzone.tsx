// src/components/landing/UploadDropzone.tsx
"use client";

import { useState, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, Image as ImageIcon, XCircle, Loader2, CheckCircle, FileQuestion, List } from 'lucide-react';
import { uploadReportAction, fetchSampleFilesAction } from '@/app/actions/reportActions';
import type { FullReportDataFromBackend } from '@/types/report';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '../ui/separator';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "tiff", "bmp"];
const MAX_FILE_SIZE_MB = 16; // Matching backend's MAX_CONTENT_LENGTH
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface SampleFile {
  filename: string;
  size: number;
  extension: string;
}

export default function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedSampleFile, setSelectedSampleFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { 
    data: sampleFilesData, 
    isLoading: isLoadingSamples, 
    isError: isSampleFilesError,
    error: sampleFilesErrorData,
  } = useQuery<{ success: boolean; data?: SampleFile[]; error?: string }, Error, SampleFile[] | undefined>({
    queryKey: ['sampleFiles'],
    queryFn: async () => {
      const result = await fetchSampleFilesAction();
      if (!result.success) {
        // Throw an error to be caught by React Query's error handling
        throw new Error(result.error || "Failed to fetch sample files");
      }
      return result.data;
    },
    select: (data) => data, // data here is SampleFile[] | undefined
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const sampleFiles: SampleFile[] = sampleFilesData || [];


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedSampleFile) { 
      setIsDragging(true);
    }
  }, [selectedSampleFile]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setIsSuccess(false);
    setSelectedSampleFile(null); 
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}.`);
      setFile(null);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum size: ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setSelectedSampleFile(null); 
    setError(null);
    setUploadProgress(0);
    setIsSuccess(false);
  };

  const handleSampleFileSelect = (filename: string) => {
    if (filename === "none") {
        setSelectedSampleFile(null);
        setError(null);
    } else {
        setSelectedSampleFile(filename);
        setFile(null); 
        setError(null);
        setIsSuccess(false);
    }
  };

  const handleSubmit = async () => {
    if (!file && !selectedSampleFile) {
      setError("Please select a file to upload or choose a sample report.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0); 
    setError(null);
    setIsSuccess(false);

    let actionInput: File | string;
    let isSampleUpload: boolean;

    if (file) {
      actionInput = file;
      isSampleUpload = false;
    } else if (selectedSampleFile) {
      actionInput = selectedSampleFile;
      isSampleUpload = true;
    } else {
      setError("No file or sample selected.");
      setIsLoading(false);
      return;
    }

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress <= 90) {
        setUploadProgress(currentProgress);
      } else {
        clearInterval(progressInterval);
      }
    }, 150);

    try {
      const result = await uploadReportAction(actionInput, isSampleUpload);
      clearInterval(progressInterval);

      if (result.success && result.data) {
        setUploadProgress(100);
        setIsSuccess(true);
        toast({
          title: "Processing Successful!",
          description: `${result.data.filename} is ready to view. Redirecting...`,
          variant: 'default',
          className: 'bg-green-500 border-green-600 text-white dark:bg-green-600 dark:border-green-700 dark:text-white',
        });
        localStorage.setItem('labReportData', JSON.stringify(result.data));
        router.push(`/report/${encodeURIComponent(result.data.filename)}`);
      } else {
        setError(result.error || "An unknown error occurred during processing.");
        toast({
          title: "Processing Failed",
          description: result.error || "Could not process the report.",
          variant: "destructive",
        });
        setUploadProgress(0); 
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
      setUploadProgress(0); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFileIcon = () => {
    let currentFileDisplay: { name: string; type?: string, size?: number } | null = null;

    if (file) {
        currentFileDisplay = { name: file.name, type: file.type, size: file.size };
    } else if (selectedSampleFile) {
        const sample = sampleFiles.find(sf => sf.filename === selectedSampleFile);
        if (sample) {
            currentFileDisplay = { name: sample.filename, type: `image/${sample.extension.replace('.', '')}`, size: sample.size };
        }
    }

    if (!currentFileDisplay) return <UploadCloud size={56} className="text-muted-foreground/70" />;
    
    const extension = currentFileDisplay.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FileText size={56} className="text-red-500" />;
    if (['png', 'jpg', 'jpeg', 'bmp', 'tiff'].includes(extension || '')) return <ImageIcon size={56} className="text-blue-500" />;
    return <FileQuestion size={56} className="text-muted-foreground/70" />;
  };

  const currentFileName = file ? file.name : selectedSampleFile;
  const currentFileSize = file ? (file.size / (1024*1024)).toFixed(2) + " MB" : 
    selectedSampleFile ? 
      (() => {
        const sample = sampleFiles.find(sf => sf.filename === selectedSampleFile);
        return sample ? (sample.size / (1024*1024)).toFixed(2) + " MB" : "";
      })() 
      : "";


  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                    ${isDragging && !selectedSampleFile ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/70 bg-card hover:bg-muted/50'}
                    ${error ? 'border-destructive bg-destructive/5' : ''}
                    ${isSuccess ? 'border-green-500 bg-green-500/5' : ''}
                    ${selectedSampleFile ? 'opacity-50 cursor-not-allowed' : ''} 
                    shadow-sm hover:shadow-md`}
        onClick={() => { if (!selectedSampleFile && document.getElementById('dropzone-file')) (document.getElementById('dropzone-file') as HTMLInputElement).click()}}

      >
        <Input
          id="dropzone-file"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
          disabled={isLoading || !!selectedSampleFile}
        />
        {!currentFileName && !isLoading && (
          <div className="text-center pointer-events-none p-4">
            <UploadCloud size={56} className={`mx-auto mb-4 ${isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground/70'}`} />
            <p className={`mb-2 text-base font-semibold ${isDragging ? 'text-primary' : 'text-foreground'}`}>
              Drag & drop files here or <span className="text-accent font-bold">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: PDF, PNG, JPG, TIFF, BMP (Max {MAX_FILE_SIZE_MB}MB)
            </p>
          </div>
        )}
        {currentFileName && !isLoading && (
          <div className="text-center pointer-events-none p-4 flex flex-col items-center">
            {isSuccess ? <CheckCircle size={56} className="text-green-500 mb-3" /> : getFileIcon()}
            <p className="mt-2 text-sm font-medium text-foreground truncate max-w-xs">{currentFileName}</p>
            {currentFileSize && <p className="text-xs text-muted-foreground">{currentFileSize}</p>}
            {!isSuccess && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-destructive hover:bg-destructive/10 pointer-events-auto rounded-md"
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                aria-label="Remove file"
              >
                <XCircle size={16} className="mr-1" /> Remove Selection
              </Button>
            )}
             {isSuccess && (
              <p className="mt-2 text-sm font-medium text-green-600">Upload successful!</p>
            )}
          </div>
        )}
         {isLoading && (
          <div className="text-center p-4">
            <Loader2 size={56} className="mx-auto mb-4 text-primary animate-spin" />
            <p className="text-sm font-medium text-primary">Analyzing {currentFileName || 'report'}...</p>
            <p className="text-xs text-muted-foreground">This may take a moment.</p>
          </div>
        )}
      </div>

      {sampleFiles.length > 0 && (
        <>
          <div className="flex items-center my-4">
            <Separator className="flex-grow" />
            <span className="px-3 text-sm text-muted-foreground font-medium">OR</span>
            <Separator className="flex-grow" />
          </div>
          <div className="space-y-2">
            <label htmlFor="sample-select" className="text-sm font-medium text-foreground flex items-center">
              <List size={16} className="mr-2 text-primary" />
              Select a Sample Report:
            </label>
            {isLoadingSamples ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading samples...</span>
                </div>
            ) : isSampleFilesError ? (
              <p className="text-sm text-destructive">Error loading samples: {sampleFilesErrorData?.message || "Unknown error"}</p>
            ) : (
              <Select
                value={selectedSampleFile || "none"}
                onValueChange={handleSampleFileSelect}
                disabled={isLoading || !!file}
              >
                <SelectTrigger id="sample-select" className="w-full">
                  <SelectValue placeholder="Choose a sample..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Upload my own)</SelectItem>
                  {sampleFiles.map((sample) => (
                    <SelectItem key={sample.filename} value={sample.filename}>
                      {sample.filename} ({(sample.size / (1024*1024)).toFixed(2)} MB)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!!file && selectedSampleFile && (
                <p className="text-xs text-orange-600 dark:text-orange-400">Sample selection disabled while a file is chosen for upload.</p>
            )}
          </div>
        </>
      )}


      {error && <p className="text-sm text-destructive text-center font-medium py-2 px-3 bg-destructive/10 rounded-md">{error}</p>}

      {uploadProgress > 0 && uploadProgress < 100 && !isSuccess && (
        <div className="space-y-1 pt-2">
          <Progress value={uploadProgress} className="w-full h-2 [&>div]:bg-primary" />
          <p className="text-xs text-muted-foreground text-center">{uploadProgress}% analyzed</p>
        </div>
      )}
      
      <Button
        onClick={handleSubmit}
        disabled={(!file && !selectedSampleFile) || isLoading || isSuccess}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Report...
          </>
        ) : isSuccess ? (
           <>
            <CheckCircle className="mr-2 h-5 w-5" /> Processed! Redirecting...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-5 w-5" /> Analyze Report
          </>
        )}
      </Button>
    </motion.div>
  );
}
