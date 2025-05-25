
'use server';
/**
 * @fileOverview Provides an AI-driven risk assessment based on lab results,
 * including a summary, follow-up suggestions, and an overall risk level.
 *
 * - generateRiskAssessment - A function that handles the risk assessment process.
 * - GenerateRiskAssessmentInput - The input type for the generateRiskAssessment function.
 * - GenerateRiskAssessmentOutput - The return type for the generateRiskAssessment function.
 * - LabResultItem - The type for individual lab result items.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Zod schema for individual lab result items, consistent with frontend type
const LabResultItemSchema = z.object({
  test_name: z.string().describe('Name of the lab test.'),
  value: z.string().describe('Measured value of the test.'),
  unit: z.string().describe('Unit of measurement for the value.'),
  reference_range: z.string().describe('Normal reference range for the test.'),
  flag: z.string().optional().describe("Optional flag indicating if the result is Normal, Abnormal, High, Low, etc."),
});
export type LabResultItem = z.infer<typeof LabResultItemSchema>;

const GenerateRiskAssessmentInputSchema = z.object({
  labResults: z.array(LabResultItemSchema).describe("An array of lab result items."),
  patientContext: z.string().optional().describe("Optional patient context like age, gender, known conditions, lifestyle factors, or symptoms if available, to provide a more personalized assessment."),
});
export type GenerateRiskAssessmentInput = z.infer<typeof GenerateRiskAssessmentInputSchema>;

const GenerateRiskAssessmentOutputSchema = z.object({
  riskSummary: z.string().describe("A concise summary paragraph (2-4 sentences) highlighting potential health risks or areas of concern based on the lab results. If no significant risks, state that clearly."),
  followUpSuggestions: z.array(z.string()).describe("A list of 2-5 specific, actionable follow-up suggestions (e.g., 'Consult a specialist like a cardiologist', 'Discuss dietary changes with your doctor', 'Repeat specific tests in X weeks', 'Monitor blood pressure regularly'). Prioritize relevance to abnormal findings."),
  overallRiskLevel: z.enum(["Low", "Moderate", "High", "Normal"]).describe("An overall assessment of the patient's risk level based on the provided results. 'Normal' if all results are within range and no concerns. 'Low' if minor deviations or one-off mild concerns. 'Moderate' if multiple borderline or some clearly abnormal results needing attention. 'High' if critical values or multiple significant abnormalities suggesting urgent review."),
});
export type GenerateRiskAssessmentOutput = z.infer<typeof GenerateRiskAssessmentOutputSchema>;

export async function generateRiskAssessment(input: GenerateRiskAssessmentInput): Promise<GenerateRiskAssessmentOutput> {
  return generateRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskAssessmentPrompt',
  input: {schema: GenerateRiskAssessmentInputSchema},
  output: {schema: GenerateRiskAssessmentOutputSchema},
  prompt: `You are an expert medical AI assistant. Your task is to analyze the provided lab results and generate a risk assessment.

Based on the lab results:
1.  Write a concise risk summary (2-4 sentences). Highlight any potential health risks or areas of concern. If results are generally normal, state that.
2.  Provide a list of 2-5 specific and actionable follow-up suggestions. These could include consulting specialists, dietary changes, lifestyle adjustments, or further tests.
3.  Determine an overall risk level: "Normal", "Low", "Moderate", or "High", based on the definitions in the output schema.

Consider any values outside normal reference ranges or those flagged as abnormal.
If patient context (age, gender, medical history, symptoms) is provided, factor it into your assessment for personalization.

Lab Results:
{{#each labResults}}
- Test: {{test_name}}, Value: {{value}} {{unit}}, Reference Range: {{reference_range}}{{#if flag}}, Flag: {{flag}}{{/if}}
{{/each}}

{{#if patientContext}}
Patient Context:
{{{patientContext}}}
{{/if}}

Provide your response strictly in the JSON format defined by the output schema.
`,
});

const generateRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'generateRiskAssessmentFlow',
    inputSchema: GenerateRiskAssessmentInputSchema,
    outputSchema: GenerateRiskAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a risk assessment.");
    }
    return output;
  }
);
