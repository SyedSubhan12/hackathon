// src/app/actions/reportActions.ts
"use server";

import { revalidatePath } from 'next/cache';

interface UploadResult {
  report_id?: string;
  error?: string;
}

const FLASK_API_URL = process.env.FLASK_API_URL || "http://localhost:8000/api/upload"; // Ensure this is set in your .env.local or vercel env vars

export async function uploadReportAction(formData: FormData): Promise<UploadResult> {
  try {
    const response = await fetch(FLASK_API_URL, {
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
        return { error: `API Error: ${response.status} ${response.statusText}` };
      }
      return { error: errorBody.error || `API Error: ${response.status}` };
    }

    const result = await response.json();

    if (result.report_id) {
      // Optionally revalidate paths if you have a list of reports page
      // revalidatePath('/dashboard'); 
      revalidatePath('/'); // Revalidate landing page if it shows some status
      return { report_id: result.report_id.toString() };
    } else {
      return { error: result.error || "Upload successful, but no report_id returned." };
    }

  } catch (error) {
    console.error('Upload action error:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during upload." };
  }
}
