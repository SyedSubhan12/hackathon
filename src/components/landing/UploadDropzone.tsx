"use client";

import { useState, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, Image as ImageIcon, XCircle, Loader2 } from 'lucide-react';
import { uploadReportAction } from '@/app/actions/reportActions'; // Will create this action

const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "tiff", "bmp"];
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}.`);
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
    setError(null);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0); // Reset progress for new upload

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress for demo purposes if backend doesn't provide it via server action
      // For real progress, server action would need to stream updates or use a library
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        if (currentProgress <= 90) { // Stop at 90%, final 10% after server response
          setUploadProgress(currentProgress);
        } else {
          clearInterval(progressInterval);
        }
      }, 200);
      
      const result = await uploadReportAction(formData);
      clearInterval(progressInterval); // Clear interval once action completes

      if (result.error) {
        setError(result.error);
        toast({
          title: "Upload Failed",
          description: result.error,
          variant: "destructive",
        });
        setUploadProgress(0);
      } else if (result.report_id) {
        setUploadProgress(100);
        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded.`,
        });
        router.push(`/report/${result.report_id}`);
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <UploadCloud size={48} className="text-gray-400" />;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return <FileText size={48} className="text-red-500" />;
    if (['png', 'jpg', 'jpeg', 'bmp', 'tiff'].includes(extension || '')) return <ImageIcon size={48} className="text-blue-500" />;
    return <UploadCloud size={48} className="text-gray-400" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
                    ${error ? 'border-destructive' : ''}`}
      >
        <Input
          id="dropzone-file"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
          disabled={isLoading}
        />
        {!file && (
          <div className="text-center pointer-events-none">
            <UploadCloud size={48} className={`mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="mb-2 text-sm font-semibold ${isDragging ? 'text-primary' : 'text-foreground'}">
              Drag & drop files here or <span className="text-accent">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, PNG, JPG, JPEG, TIFF, BMP (Max {MAX_FILE_SIZE_MB}MB)
            </p>
          </div>
        )}
        {file && !isLoading && (
          <div className="text-center pointer-events-none p-4">
            {getFileIcon()}
            <p className="mt-2 text-sm font-medium text-foreground truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-destructive hover:bg-destructive/10 pointer-events-auto"
              onClick={(e) => { e.stopPropagation(); removeFile(); }}
              aria-label="Remove file"
            >
              <XCircle size={16} className="mr-1" /> Remove
            </Button>
          </div>
        )}
         {isLoading && (
          <div className="text-center p-4">
            <Loader2 size={48} className="mx-auto mb-3 text-primary animate-spin" />
            <p className="text-sm font-medium text-primary">Uploading {file?.name}...</p>
            <p className="text-xs text-muted-foreground">Please wait.</p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {uploadProgress > 0 && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="w-full h-2" />
          <p className="text-xs text-muted-foreground text-center">{uploadProgress}% uploaded</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-5 w-5" /> Upload and Analyze
          </>
        )}
      </Button>
    </div>
  );
}
