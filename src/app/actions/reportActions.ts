// src/app/actions/reportActions.ts
"use server";

import type { FullReportDataFromBackend } from '@/types/report'; // We'll create this type definition

// Ensure this URL points to your Python Flask backend's upload_pdf endpoint
const PYTHON_BACKEND_UPLOAD_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:5000/upload_pdf";

interface UploadActionResult {
  success: boolean;
  data?: FullReportDataFromBackend;
  error?: string;
}

export async function uploadReportAction(formData: FormData): Promise<UploadActionResult> {
  try {
    const response = await fetch(PYTHON_BACKEND_UPLOAD_URL, {
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
        // If response is not JSON, use status text
        return { success: false, error: `API Error: ${response.status} ${response.statusText}` };
      }
      return { success: false, error: errorBody.error || `API Error: ${response.status}` };
    }

    const result = await response.json();

    if (result.success && result.filename) { // Python backend returns a 'success' boolean
      return { success: true, data: result as FullReportDataFromBackend };
    } else {
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
