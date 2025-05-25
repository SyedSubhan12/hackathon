'use server';

/**
 * @fileOverview A flow to generate a summary of a medical lab report, including extracted data and AI-generated explanations.
 *
 * - generateReportSummary - A function that generates the report summary.
 * - GenerateReportSummaryInput - The input type for the generateReportSummary function.
 * - GenerateReportSummaryOutput - The return type for the generateReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSummaryInputSchema = z.object({
  reportData: z.string().describe('The extracted data from the lab report in JSON format.'),
  explanation: z.string().describe('The AI-generated explanation of the lab results.'),
});
export type GenerateReportSummaryInput = z.infer<typeof GenerateReportSummaryInputSchema>;

const GenerateReportSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the lab results and AI-generated explanations in PDF/CSV format.'),
});
export type GenerateReportSummaryOutput = z.infer<typeof GenerateReportSummaryOutputSchema>;

export async function generateReportSummary(input: GenerateReportSummaryInput): Promise<GenerateReportSummaryOutput> {
  return generateReportSummaryFlow(input);
}

const generateReportSummaryPrompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: GenerateReportSummaryInputSchema},
  output: {schema: GenerateReportSummaryOutputSchema},
  prompt: `You are an expert in medical lab reports. Given the extracted data and AI-generated explanations,
  create a concise and informative summary that can be easily shared with healthcare providers or kept for personal records.

  Extracted Data:
  {{reportData}}

  AI-Generated Explanations:
  {{explanation}}

  Create a PDF/CSV formatted summary including the extracted data and explanations:
  `, // Ensure the output will be PDF/CSV formatted for download
});

const generateReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateReportSummaryFlow',
    inputSchema: GenerateReportSummaryInputSchema,
    outputSchema: GenerateReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await generateReportSummaryPrompt(input);
    return output!;
  }
);
