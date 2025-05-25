
// src/app/actions/reportActions.ts
"use server";

import type { FullReportDataFromBackend } from '@/types/report';

// Ensure this URL points to your Python Flask backend
const PYTHON_BACKEND_BASE_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:5000";

interface UploadActionResult {
  success: boolean;
  data?: FullReportDataFromBackend;
  error?: string;
}

export async function uploadReportAction(
  fileOrFilename: File | string,
  isSample: boolean
): Promise<UploadActionResult> {
  const formData = new FormData();
  let endpoint = `${PYTHON_BACKEND_BASE_URL}/upload_pdf`;

  if (isSample && typeof fileOrFilename === 'string') {
    formData.append('selected_file', fileOrFilename);
  } else if (fileOrFilename instanceof File) {
    formData.append('file', fileOrFilename);
  } else {
    console.error("Invalid input to uploadReportAction: fileOrFilename is not a File or string.", fileOrFilename);
    return { success: false, error: "Invalid input for upload." };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      // Do not set Content-Type header manually when using FormData with fetch,
      // the browser (or Node's fetch in this case) will set it correctly with the boundary.
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        return { success: false, error: `API Error: ${response.status} ${response.statusText}` };
      }
      return { success: false, error: errorBody.error || `API Error: ${response.status}` };
    }

    const result = await response.json();

    // Assuming the Python backend returns 'success: true' directly in its main response object
    if (result.success && result.filename) {
      return { success: true, data: result as FullReportDataFromBackend };
    } else {
      // If backend sends success:false or result.error, use that
      return { success: false, error: result.error || "Upload processed, but unexpected data returned from backend." };
    }

  } catch (error) {
    console.error('Upload action error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred during upload." };
  }
}

// New action to fetch sample files
interface SampleFile {
  filename: string;
  size: number;
  extension: string;
}

interface FetchSamplesResult {
  success: boolean;
  data?: SampleFile[];
  error?: string;
}

export async function fetchSampleFilesAction(): Promise<FetchSamplesResult> {
  const endpoint = `${PYTHON_BACKEND_BASE_URL}/sample_files`;
  console.log(`Fetching sample files from: ${endpoint}`);
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      let errorBody;
      const errorStatusText = `API Error: ${response.status} ${response.statusText}`;
      try {
        errorBody = await response.json();
        console.error(`API Error fetching samples (${response.status}):`, errorBody);
      } catch (e) {
        console.error(`${errorStatusText}. Failed to parse error body as JSON. Response text: ${await response.text().catch(() => 'Could not read response text.')}`);
        return { success: false, error: errorStatusText };
      }
      return { success: false, error: errorBody.error || `API Error fetching samples: ${response.status}` };
    }
    const result = await response.json();
    if (result.sample_files) {
      return { success: true, data: result.sample_files as SampleFile[] };
    } else {
      console.warn('No sample files found or unexpected format from /sample_files:', result);
      return { success: false, error: result.error || "No sample files found or unexpected format."};
    }
  } catch (error) {
    console.error(`Fetch sample files action error for endpoint ${endpoint}:`, error); 
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred while fetching sample files." };
  }
}
