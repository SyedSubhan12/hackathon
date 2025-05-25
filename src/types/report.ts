// src/types/report.ts

// For data structured and consumed by frontend components (like OCRTable)
export interface LabResultItem {
  test_name: string;
  value: string; // Display value, original might be number
  unit: string;
  reference_range: string;
  flag?: 'Normal' | 'Abnormal' | 'High' | 'Low' | string; 
}

// Structure of the AI analysis object from the Python backend
export interface AiAnalysis {
  explanation: string;
  summary: string;
  abnormal_results: string[];
  total_tests: number;
  abnormal_count: number;
  model_used: string;
  error?: string; // Optional: if AI analysis had an issue (e.g. fallback)
}

// Structure of the processing info object from the Python backend
export interface ProcessingInfo {
  extracted_text_length: number;
  structured_results_count: number;
  processing_steps_completed?: string[];
  ai_model?: string; // This is also in AiAnalysis, but can be here too
}

// Structure for individual lab result items from the Python backend
export interface BackendLabResultItem {
  test: string;        // Maps to test_name
  value: number;       // Frontend might convert to string for display
  unit: string;
  low: number;         // Used to form reference_range
  high: number;        // Used to form reference_range
  // The Python backend doesn't seem to add a 'flag' directly to structured_data
  // It's derived in `generate_explanation` or can be derived on frontend.
}

// Overall structure of the JSON response from the Python backend's /upload_pdf
export interface FullReportDataFromBackend {
  success: boolean;
  filename: string;
  processing_info: ProcessingInfo;
  ai_analysis: AiAnalysis;
  structured_data: BackendLabResultItem[];
  raw_text_preview: string;
  error?: string; // Top-level error if the whole processing failed
}
