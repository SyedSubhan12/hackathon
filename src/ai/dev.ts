
import { config } from 'dotenv';
config();

import '@/ai/flows/explain-lab-results.ts';
import '@/ai/flows/generate-report-summary.ts';
import '@/ai/flows/generate-risk-assessment.ts'; // Added new flow
