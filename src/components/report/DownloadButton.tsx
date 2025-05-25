"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  reportId: number;
  filename: string; // Original filename to suggest a download name
}

export default function DownloadButton({ reportId, filename }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const apiUrlBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrlBase}/reports/${reportId}/download`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to download summary: ${response.statusText}`);
      }

      const blob = await response.blob();
      const suggestedFilename = `LabLex_Summary_${filename.split('.')[0]}.pdf`; // Assuming PDF, adjust if CSV
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your report summary is downloading.",
      });

    } catch (error) {
      console.error("Download error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isLoading} 
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 shadow-md"
      aria-label="Download report summary"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-5 w-5" /> Download Summary
        </>
      )}
    </Button>
  );
}
